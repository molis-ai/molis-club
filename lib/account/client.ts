import type { ClubAccountConfig } from './config.ts';
import { readClubAccountConfig } from './config.ts';
import {
  namedSchema,
  operationById,
  resolveParameters,
  validParameter,
  validateBody,
  type OperationEntry,
} from './contract.ts';
import { validateNamed } from './contracts/validate.ts';
import type {
  CentralOperationId,
  CentralOperations,
  ErrorResponse,
  MeView,
  SessionView,
} from './contracts/types.ts';
import { AccountFailure, assertServer, requireAccount } from './errors.ts';

/** This binding is obtained from the server session owner, never browser JSON/headers. */
export interface AccountSession {
  accessToken: string;
  userId: string;
  loginSessionId: string;
}
export interface CallInput<K extends CentralOperationId = CentralOperationId> {
  body?: CentralOperations[K]['body'];
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  idempotencyKey?: string;
  initiatorProof?: string;
}
export interface CallContext {
  session?: AccountSession;
  signal?: AbortSignal;
  assertCurrent?: () => Promise<void>;
}
type TransportContext = Omit<CallContext, 'session'> & {
  session?: Pick<AccountSession, 'accessToken'>;
};
export type AccountFetch = (request: Request) => Promise<Response>;
const MAX_BODY = 2 * 1024 * 1024;

export async function boundedJson(
  response: Response | Request,
): Promise<unknown> {
  requireAccount(
    response.headers.get('content-type')?.split(';')[0].trim() ===
      'application/json',
  );
  const reader = response.body?.getReader();
  requireAccount(reader);
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      requireAccount(size <= MAX_BODY);
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    all.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(all));
  } catch {
    throw new AccountFailure(400, 'INVALID_REQUEST');
  }
}

/** Fixed Auth operations only. No cookies, generic URL, headers, retries, or JWT decoding. */
export function createCentralAccountClient(
  config: ClubAccountConfig,
  send: AccountFetch = fetch,
) {
  assertServer();
  const { generation, ...registration } = config;
  const pinned = readClubAccountConfig(JSON.stringify(registration), generation)!;
  function checkSession(session: SessionView): void {
    requireAccount(
      session.clientId === pinned.client.clientId &&
        session.applicationId === pinned.applicationId,
      403,
      'POLICY_MISMATCH',
    );
    requireAccount(
      Date.parse(session.idleExpiresAt) > Date.now() &&
        Date.parse(session.absoluteExpiresAt) > Date.now(),
      401,
      'SESSION_EXPIRED',
    );
  }
  async function request(
    entry: OperationEntry,
    input: CallInput,
    context: TransportContext,
  ): Promise<unknown> {
    requireAccount(
      Object.keys(input).every((key) =>
        ['body', 'path', 'query', 'idempotencyKey', 'initiatorProof'].includes(
          key,
        ),
      ),
    );
    const path = resolveParameters(entry, input.path, input.query);
    validateBody(entry.operation, input.body);
    const headers = new Headers({
      Accept: 'application/json',
      Origin: pinned.client.productOrigin,
    });
    for (const p of entry.operation.parameters.filter(
      (p) => p.in === 'header',
    )) {
      const value =
        p.name === 'Idempotency-Key'
          ? input.idempotencyKey
          : input.initiatorProof;
      requireAccount(
        value === undefined ? !p.required : validParameter(p, value),
      );
      if (value !== undefined) headers.set(p.name, value);
    }
    if (input.idempotencyKey !== undefined)
      requireAccount(
        entry.operation.parameters.some((p) => p.name === 'Idempotency-Key'),
      );
    if (input.initiatorProof !== undefined)
      requireAccount(
        entry.operation.parameters.some(
          (p) => p.name === 'X-Auth-Initiator-Proof',
        ),
      );
    if (context.session) {
      requireAccount(
        validateNamed('OpaqueSecret', context.session.accessToken),
      );
      headers.set('Authorization', `Bearer ${context.session.accessToken}`);
    }
    if (input.body !== undefined)
      headers.set('Content-Type', 'application/json');
    const signal = context.signal
      ? AbortSignal.any([context.signal, AbortSignal.timeout(15_000)])
      : AbortSignal.timeout(15_000);
    await context.assertCurrent?.();
    let response: Response, result: unknown;
    try {
      response = await send(
        new Request(pinned.client.authOrigin + path, {
          method: entry.method,
          headers,
          // Workers accepts manual redirects. Reject them before reading the body.
          redirect: 'manual',
          credentials: 'omit',
          cache: 'no-store',
          signal,
          ...(input.body === undefined
            ? {}
            : { body: JSON.stringify(input.body) }),
        }),
      );
      requireAccount(
        (response.status < 300 || response.status >= 400) &&
          !response.redirected &&
          (response.url === '' ||
            new URL(response.url).origin === pinned.client.authOrigin),
      );
      result = await boundedJson(response);
    } catch {
      throw new AccountFailure(503, 'UPSTREAM_UNAVAILABLE');
    }
    await context.assertCurrent?.();
    const output = entry.operation.responses[String(response.status)];
    requireAccount(
      output &&
        validateNamed(
          namedSchema(output.content['application/json'].schema),
          result,
        ),
      503,
      'AUTH_UNAVAILABLE',
    );
    if (response.status !== 200) {
      const error = (result as ErrorResponse).error;
      // Do not forward arbitrary upstream text, fields or an upstream request identifier.
      throw new AccountFailure(
        response.status,
        error.code,
        error.retryAfterSeconds,
      );
    }
    return result;
  }
  async function readAccount(
    session: AccountSession,
    signal?: AbortSignal,
    assertCurrent?: () => Promise<void>,
  ): Promise<MeView> {
    requireAccount(
      validateNamed('Id', session.userId) &&
        validateNamed('Id', session.loginSessionId),
    );
    const result = await identifyToken(
      session.accessToken,
      signal,
      assertCurrent,
    );
    requireAccount(
      result.user.userId === session.userId &&
        result.session.loginSessionId === session.loginSessionId,
      403,
      'POLICY_MISMATCH',
    );
    return result;
  }
  /** Resolve identity after a server-side token exchange, without decoding opaque tokens. */
  async function identifyToken(
    accessToken: string,
    signal?: AbortSignal,
    assertCurrent?: () => Promise<void>,
  ): Promise<MeView> {
    const result = (await request(
      operationById('getMe', '/api/v2/'),
      {},
      { session: { accessToken }, signal, assertCurrent },
    )) as CentralOperations['getMe']['output'];
    checkSession(result.data.session);
    requireAccount(
      result.data.user.issuer === pinned.client.authOrigin,
      403,
      'POLICY_MISMATCH',
    );
    return result.data;
  }
  async function call<K extends CentralOperationId>(
    id: K,
    input: CallInput<K> = {},
    context: CallContext = {},
  ): Promise<CentralOperations[K]['output']> {
    if (id === 'listLoginMethods') {
      // One authoritative profile snapshot; never reconstruct display labels here.
      const result = await call('getMe', input as CallInput<'getMe'>, context);
      return {
        ...result,
        data: { loginMethods: result.data.loginMethods, version: result.data.user.version },
      } as CentralOperations[K]['output'];
    }
    const entry = operationById(id, '/api/v2/');
    const sessionRequired =
      entry.operation.security.length > 0 &&
      entry.operation.security.every((security) => 'bearerAuth' in security);
    requireAccount(!sessionRequired || context.session, 401, 'SESSION_EXPIRED');
    if (context.session)
      await readAccount(context.session, context.signal, context.assertCurrent);
    const body = input.body as Record<string, unknown> | undefined;
    if (
      ['createTransaction', 'createReauthentication', 'exchangeToken', 'loginPassword', 'sendLoginVerification'].includes(
        id,
      )
    ) {
      requireAccount(body?.clientId === pinned.client.clientId);
      if ('redirectUri' in body)
        requireAccount(body.redirectUri === pinned.redirectUri);
      if (['REAUTH', 'BIND', 'REPLACE'].includes(String(body.purpose)))
        requireAccount(context.session, 401, 'SESSION_EXPIRED');
    }
    if ((id === 'logoutCurrent' || id === 'logoutAll') && body?.refreshProof)
      requireAccount(
        (body.refreshProof as { clientId?: string }).clientId ===
          pinned.client.clientId,
      );
    const output = (await request(
      entry,
      input,
      context,
    )) as CentralOperations[K]['output'];
    const data = output.data as Record<string, unknown>;
    if (id === 'getMe') {
      const me = output.data as MeView;
      checkSession(me.session);
      requireAccount(
        me.user.issuer === pinned.client.authOrigin &&
          me.user.userId === context.session?.userId &&
          me.session.loginSessionId === context.session.loginSessionId,
        403,
        'POLICY_MISMATCH',
      );
    }
    if (id === 'getCurrentSession') {
      checkSession(output.data as SessionView);
      requireAccount(
        data.loginSessionId === context.session?.loginSessionId,
        403,
        'POLICY_MISMATCH',
      );
    }
    if (id === 'exchangeToken') checkSession(data.session as SessionView);
    if (id === 'updateProfile')
      requireAccount(
        data.issuer === pinned.client.authOrigin &&
          data.userId === context.session?.userId,
        403,
        'POLICY_MISMATCH',
      );
    if (id === 'startGoogle' || id === 'startGitHub') {
      const target = new URL(String(data.browserStartUrl));
      const provider = id === 'startGoogle' ? 'google' : 'github';
      requireAccount(
        target.origin === pinned.client.authOrigin &&
          target.pathname ===
            `/api/v2/auth/external/${provider}/browser-start` &&
          !target.hash &&
          [...target.searchParams.keys()].join(',') === 'ticket',
        503,
        'AUTH_UNAVAILABLE',
      );
    }
    return output;
  }
  return Object.freeze({ call, readAccount, identifyToken, config: pinned });
}
export type CentralAccountClient = ReturnType<
  typeof createCentralAccountClient
>;
