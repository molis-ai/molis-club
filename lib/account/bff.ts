import {
  boundedJson,
  type AccountSession,
  type CentralAccountClient,
  type CallInput,
} from './client.ts';
import {
  operations,
  operationById,
  namedSchema,
  resolveParameters,
  validateBody,
  type OperationEntry,
} from './contract.ts';
import { validateNamed } from './contracts/validate.ts';
import type {
  AccountView,
  ActivityRequest,
  CentralOperationId,
  ProductLogoutRequest,
  ProductLogoutResult,
  SessionViewResponse,
} from './contracts/types.ts';
import { AccountFailure, accountFailure, requireAccount } from './errors.ts';

/** CLUB-02 supplies persistent sessions and CSRF. Browser identity is never an input. */
export interface AccountSessionPort {
  read(request: Request): Promise<AccountSession | null>;
  verifyCsrf(request: Request, session: AccountSession): Promise<boolean>;
  assertCurrent(session: AccountSession): Promise<void>;
  readView?(request: Request): Promise<AccountView>;
  activity?(
    request: Request,
    input: ActivityRequest,
  ): Promise<SessionViewResponse>;
  logout?(
    request: Request,
    input: ProductLogoutRequest,
    key: string,
  ): Promise<ProductLogoutResult>;
}
export const anonymousAccountSessions: AccountSessionPort = Object.freeze({
  read: async () => null,
  verifyCsrf: async () => false,
  assertCurrent: async () => {
    throw new AccountFailure(401, 'SESSION_EXPIRED');
  },
});
// Mapping between frozen product and central operations; credential translations
// and logout orchestration are intentionally implemented by CLUB-02/03/04 later.
const specialMappings = new Map([
  ['productUpdateProfile', 'updateProfile'],
  ['productListLoginMethods', 'listLoginMethods'],
]);
export function mappedCentralOperation(
  productId: string,
): CentralOperationId | null {
  operationById(productId, '/api/account/');
  const centralId =
    specialMappings.get(productId) ??
    (productId.startsWith('product_') ? productId.slice(8) : null);
  if (!centralId) return null;
  operationById(centralId, '/api/v2/');
  return centralId as CentralOperationId;
}
function response(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
function decodePath(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new AccountFailure(400, 'INVALID_REQUEST');
  }
}
function matchRoute(request: Request): {
  entry: OperationEntry;
  path: Record<string, string>;
  query: Record<string, unknown>;
} {
  const url = new URL(request.url);
  for (const entry of operations.filter(
    (e) => e.path.startsWith('/api/account/') && e.method === request.method,
  )) {
    const names: string[] = [];
    const pattern = entry.path
      .replace(/[.*+?^$()|[\]\\]/g, '\\$&')
      .replace(/\{([^}]+)\}/g, (_, name: string) => {
        names.push(name);
        return '([^/]+)';
      });
    const match = new RegExp(`^${pattern}$`).exec(url.pathname);
    if (!match) continue;
    const path = Object.fromEntries(
      names.map((name, index) => [name, decodePath(match[index + 1])]),
    );
    const query: Record<string, unknown> = {};
    for (const [key, value] of url.searchParams) {
      requireAccount(!Object.hasOwn(query, key));
      const p = entry.operation.parameters.find(
        (p) => p.in === 'query' && p.name === key,
      );
      requireAccount(p);
      if (p.schema.type === 'integer')
        requireAccount(/^(0|[1-9][0-9]*)$/.test(value));
      query[key] = p.schema.type === 'integer' ? Number(value) : value;
    }
    resolveParameters(entry, path, query);
    return { entry, path, query };
  }
  throw new AccountFailure(404, 'NOT_FOUND');
}
/** An internal fixed-route handler. The app mounts only explicitly implemented routes. */
export function createAccountBff(
  client: CentralAccountClient,
  sessions: AccountSessionPort = anonymousAccountSessions,
) {
  return async function handle(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url),
        origin = client.config.client.productOrigin;
      requireAccount(
        url.origin === origin &&
          (!request.headers.has('origin') ||
            request.headers.get('origin') === origin),
        403,
        'FORBIDDEN',
      );
      requireAccount(
        !['cross-site', 'same-site'].includes(
          request.headers.get('sec-fetch-site') ?? '',
        ),
        403,
        'FORBIDDEN',
      );
      requireAccount(
        !request.headers.has('authorization') &&
          !request.headers.has('x-auth-initiator-proof'),
      );
      const { entry, path, query } = matchRoute(request);
      const body =
        request.method === 'GET' ? undefined : await boundedJson(request);
      validateBody(entry.operation, body);
      if (
        entry.operation.operationId === 'productActivity' &&
        sessions.activity
      )
        return response(
          await sessions.activity(request, body as ActivityRequest),
        );
      if (entry.operation.operationId === 'productLogout' && sessions.logout) {
        const key = request.headers.get('idempotency-key');
        requireAccount(key && key.length >= 16 && key.length <= 128);
        return response({
          data: await sessions.logout(
            request,
            body as ProductLogoutRequest,
            key,
          ),
          requestId: crypto.randomUUID(),
        });
      }
      if (entry.operation.operationId === 'productSession' && sessions.readView)
        return response({
          data: await sessions.readView(request),
          requestId: crypto.randomUUID(),
        });
      const binding = await sessions.read(request);
      if (entry.operation.operationId === 'productSession') {
        let data: AccountView = { state: 'ANONYMOUS' };
        if (binding) {
          await sessions.assertCurrent(binding);
          const me = await client.readAccount(binding, request.signal, () =>
            sessions.assertCurrent(binding),
          );
          await sessions.assertCurrent(binding);
          data = {
            state: 'AUTHENTICATED',
            user: me.user,
            session: me.session,
            capabilities: me.platformCapabilities,
          };
        }
        return response({ data, requestId: crypto.randomUUID() });
      }
      const mapped = mappedCentralOperation(entry.operation.operationId);
      requireAccount(mapped, 501, 'UNIFIED_ACCOUNT_NOT_IMPLEMENTED');
      requireAccount(binding, 401, 'SESSION_EXPIRED');
      if (request.method !== 'GET')
        requireAccount(
          request.headers.get('origin') === origin &&
            (await sessions.verifyCsrf(request, binding)),
          403,
          'FORBIDDEN',
        );
      await sessions.assertCurrent(binding);
      const input: CallInput = {
        path,
        query,
        ...(body === undefined ? {} : { body: body as CallInput['body'] }),
      };
      const key = request.headers.get('idempotency-key');
      if (key !== null) input.idempotencyKey = key;
      const result = await client.call(mapped, input, {
        session: binding,
        signal: request.signal,
        assertCurrent: () => sessions.assertCurrent(binding),
      });
      await sessions.assertCurrent(binding);
      requireAccount(
        validateNamed(
          namedSchema(
            entry.operation.responses['200'].content['application/json'].schema,
          ),
          result,
        ),
        503,
        'AUTH_UNAVAILABLE',
      );
      return response(result);
    } catch (error) {
      const failure = accountFailure(error);
      return response(failure.envelope, failure.status);
    }
  };
}
