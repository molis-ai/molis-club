import type { AccountSession, CentralAccountClient } from './client.ts';
import type { AccountSessionPort } from './bff.ts';
import type {
  AccountView,
  ActivityRequest,
  MeView,
  ProductLogoutRequest,
  ProductLogoutResult,
  SessionView,
  TokenSet,
  UserView,
} from './contracts/types.ts';
import { validateNamed } from './contracts/validate.ts';
import { AccountFailure, requireAccount } from './errors.ts';
import {
  createSessionStore,
  type SessionRow,
  type StoredSession,
} from './session-store.ts';
import {
  createSessionCryptography,
  digestSessionSecret,
  randomSessionSecret,
} from './session-crypto.ts';

export interface LoginPermit {
  readonly browserDigest: string;
  readonly epoch: number;
  readonly nonce: string;
}
interface BrowserBinding {
  raw: string;
  row: SessionRow;
}
interface TrustedBinding {
  id: string;
  epoch: number;
  userId: string;
  loginId: string;
}
export interface SessionManagerOptions {
  db: D1Database;
  client: CentralAccountClient;
  encryptionKey: string | undefined;
  /** Deterministic clock/scheduler ports for isolated tests; never browser inputs. */
  now?: () => number;
  pause?: (milliseconds: number) => Promise<void>;
  refreshLeaseMs?: number;
}
const ANONYMOUS_MS = 15 * 60_000;
const expiry = (session: SessionView) =>
  Math.min(
    Date.parse(session.idleExpiresAt),
    Date.parse(session.absoluteExpiresAt),
  );
const failure = (error: unknown, status: number) =>
  error instanceof AccountFailure && error.status === status;

/** Persistent owner. A fresh instance per Worker/request shares only D1, never an in-memory refresh promise. */
export async function createClubSessionManager(options: SessionManagerOptions) {
  const { client } = options,
    config = client.config;
  const context = await digestSessionSecret(JSON.stringify(config));
  const store = createSessionStore(options.db, context);
  const cryptography = createSessionCryptography(
    options.encryptionKey,
    context,
  );
  const now = options.now ?? Date.now;
  const pause =
    options.pause ??
    ((milliseconds) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds)));
  const leaseMs = options.refreshLeaseMs ?? 20_000;
  requireAccount(
    leaseMs > 0 && Number.isFinite(leaseMs),
    503,
    'UNIFIED_CONFIGURATION_INVALID',
  );
  const secure = new URL(config.client.productOrigin).protocol === 'https:';
  const cookieName = `${secure ? '__Host-molis-club-account' : 'molis-club-local-account'}-${context.slice(0, 12)}`;
  const headers = new WeakMap<Request, Headers>();
  const bindings = new WeakMap<AccountSession, TrustedBinding>();
  const outputHeaders = (request: Request) => {
    const current = headers.get(request) ?? new Headers();
    headers.set(request, current);
    return current;
  };
  const cookieValue = (request: Request) => {
    const values = (request.headers.get('cookie') ?? '')
      .split(';')
      .map((v) => v.trim())
      .filter((v) => v.startsWith(cookieName + '='));
    requireAccount(values.length <= 1, 400, 'INVALID_REQUEST');
    const value = values[0]?.slice(cookieName.length + 1);
    return value && /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null;
  };
  const setCookie = (request: Request, raw: string, until: number) => {
    const seconds = Math.max(0, Math.floor((until - now()) / 1000));
    outputHeaders(request).set(
      'Set-Cookie',
      `${cookieName}=${raw}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}; Expires=${new Date(until).toUTCString()}${secure ? '; Secure' : ''}`,
    );
  };
  const csrf = async (request: Request, raw: string) =>
    outputHeaders(request).set('X-CSRF-Token', await cryptography.csrf(raw));
  async function browser(
    request: Request,
    create = false,
  ): Promise<BrowserBinding | null> {
    const raw = cookieValue(request);
    if (raw) {
      let row = await store.get(await digestSessionSecret(raw));
      if (row?.state === 'LOGGING_OUT' && (row.logout_until ?? 0) <= now()) {
        row =
          (await store.abandonLogout(row, now())) ?? (await store.get(row.id));
      }
      if (row) return { raw, row };
    }
    if (!create) return null;
    const fresh = randomSessionSecret(),
      row = await store.create(
        await digestSessionSecret(fresh),
        now(),
        now() + ANONYMOUS_MS,
      );
    requireAccount(row, 503, 'AUTH_UNAVAILABLE');
    setCookie(request, fresh, row.expires_at);
    return { raw: fresh, row };
  }
  async function current(binding: TrustedBinding, allowRefreshing = true) {
    const row = await store.get(binding.id);
    requireAccount(
      row &&
        row.epoch === binding.epoch &&
        row.user_id === binding.userId &&
        row.login_id === binding.loginId &&
        (row.state === 'ACTIVE' ||
          (allowRefreshing && row.state === 'REFRESHING')) &&
        row.expires_at > now(),
      401,
      'SESSION_EXPIRED',
    );
    return row;
  }
  function trust(row: SessionRow): TrustedBinding {
    requireAccount(row.user_id && row.login_id, 401, 'SESSION_EXPIRED');
    return {
      id: row.id,
      epoch: row.epoch,
      userId: row.user_id,
      loginId: row.login_id,
    };
  }
  async function assertCurrent(binding: AccountSession) {
    const trusted = bindings.get(binding);
    requireAccount(trusted, 401, 'SESSION_EXPIRED');
    await current(trusted);
  }
  async function retire(row: SessionRow) {
    for (;;) {
      const latest = await store.get(row.id);
      if (
        !latest ||
        latest.epoch !== row.epoch ||
        !['ACTIVE', 'REFRESHING'].includes(latest.state)
      )
        return;
      if (await store.expire(latest)) return;
    }
  }
  function checkTokenSet(
    tokens: TokenSet,
    row?: SessionRow,
    allowExpiredAccess = false,
  ) {
    requireAccount(
      validateNamed('TokenSet', tokens) &&
        tokens.session.clientId === config.client.clientId &&
        tokens.session.applicationId === config.applicationId &&
        (row
          ? row.expires_at > now() &&
            Date.parse(tokens.session.absoluteExpiresAt) > now()
          : expiry(tokens.session) > now()) &&
        (allowExpiredAccess || Date.parse(tokens.accessExpiresAt) > now()) &&
        (!row || tokens.session.loginSessionId === row.login_id),
      401,
      'SESSION_EXPIRED',
    );
  }
  function sameSession(actual: SessionView, expected: SessionView) {
    requireAccount(
      actual.loginSessionId === expected.loginSessionId &&
        actual.applicationId === expected.applicationId &&
        actual.clientId === expected.clientId &&
        actual.authenticatedAt === expected.authenticatedAt &&
        actual.absoluteExpiresAt === expected.absoluteExpiresAt &&
        expiry(actual) > now(),
      403,
      'POLICY_MISMATCH',
    );
  }
  async function stored(
    tokens: TokenSet,
    me: MeView,
    row: Pick<SessionRow, 'id' | 'epoch'>,
  ): Promise<StoredSession> {
    checkTokenSet(tokens);
    sameSession(me.session, tokens.session);
    requireAccount(
      me.user.issuer === config.client.authOrigin &&
        me.session.loginSessionId === tokens.session.loginSessionId &&
        me.session.clientId === config.client.clientId &&
        me.session.applicationId === config.applicationId,
      403,
      'POLICY_MISMATCH',
    );
    return {
      userId: me.user.userId,
      loginId: me.session.loginSessionId,
      tokenBox: await cryptography.seal(tokens, {
        ...row,
        user_id: me.user.userId,
        login_id: me.session.loginSessionId,
      }),
      accessExpiresAt: Date.parse(tokens.accessExpiresAt),
      expiresAt: expiry(me.session),
      user: JSON.stringify(me.user),
      session: JSON.stringify(me.session),
    };
  }
  async function revokeTokens(tokens: TokenSet) {
    try {
      await client.call('logoutCurrent', {
        body: {
          refreshProof: {
            clientId: config.client.clientId,
            refreshToken: tokens.refreshToken,
          },
        },
        idempotencyKey: randomSessionSecret(),
      });
    } catch {
      /* Cleanup is best effort; local fencing already denies reuse and no credentials are persisted. */
    }
  }
  async function refresh(
    initial: SessionRow,
    force = false,
  ): Promise<SessionRow> {
    let row = initial;
    for (;;) {
      requireAccount(
        row.epoch === initial.epoch && row.expires_at > now(),
        401,
        'SESSION_EXPIRED',
      );
      if (row.state === 'REFRESHING') {
        if ((row.refresh_until ?? 0) <= now()) {
          await store.expire(row);
          throw new AccountFailure(401, 'SESSION_EXPIRED');
        }
        await pause(Math.min(50, (row.refresh_until ?? 0) - now()));
        const next = await store.get(row.id);
        requireAccount(next, 401, 'SESSION_EXPIRED');
        row = next;
        force = false;
        continue;
      }
      requireAccount(row.state === 'ACTIVE', 401, 'SESSION_EXPIRED');
      if (!force && (row.access_expires_at ?? 0) > now() + 30_000) return row;
      const tokens = await cryptography.open(row);
      checkTokenSet(tokens, row, true);
      const lease = randomSessionSecret(),
        claimed = await store.claim(row, lease, now() + leaseMs);
      if (!claimed) {
        const next = await store.get(row.id);
        requireAccount(next, 401, 'SESSION_EXPIRED');
        if (next.token_box !== row.token_box) force = false;
        row = next;
        continue;
      }
      let rotated: TokenSet | undefined;
      try {
        rotated = (
          await client.call('exchangeToken', {
            body: {
              grantType: 'refresh_token',
              clientId: config.client.clientId,
              refreshToken: tokens.refreshToken,
            },
          })
        ).data;
        checkTokenSet(rotated, claimed);
        sameSession(rotated.session, tokens.session);
        await current(trust(claimed));
        const me = await client.identifyToken(
          rotated.accessToken,
          undefined,
          async () => {
            await current(trust(claimed));
          },
        );
        requireAccount(
          me.user.userId === claimed.user_id,
          403,
          'POLICY_MISMATCH',
        );
        const committed = await store.refreshed(
          claimed,
          lease,
          await stored(rotated, me, claimed),
          now(),
        );
        requireAccount(committed, 401, 'SESSION_EXPIRED');
        return committed;
      } catch (error) {
        try {
          await retire(claimed);
        } finally {
          if (rotated) await revokeTokens(rotated);
        }
        throw error;
      }
    }
  }
  async function verified(
    initial: SessionRow,
  ): Promise<{ row: SessionRow; binding: AccountSession; me: MeView }> {
    let row = initial;
    if (row.expires_at <= now()) {
      await retire(row);
      throw new AccountFailure(401, 'SESSION_EXPIRED');
    }
    let refreshedOnUnauthorized = false;
    for (;;) {
      row = await refresh(row);
      const tokens = await cryptography.open(row),
        binding = {
          accessToken: tokens.accessToken,
          userId: row.user_id!,
          loginSessionId: row.login_id!,
        };
      bindings.set(binding, trust(row));
      try {
        const me = await client.readAccount(binding, undefined, () =>
          assertCurrent(binding),
        );
        sameSession(me.session, tokens.session);
        const latest = await current(trust(row));
        const cached = await store.cache(
          latest,
          JSON.stringify(me.user),
          JSON.stringify(me.session),
          expiry(me.session),
        );
        if (cached) row = cached;
        await assertCurrent(binding);
        return { row, binding, me };
      } catch (error) {
        if (failure(error, 401) && !refreshedOnUnauthorized) {
          const latest = await store.get(row.id);
          requireAccount(
            latest &&
              latest.epoch === row.epoch &&
              ['ACTIVE', 'REFRESHING'].includes(latest.state),
            401,
            'SESSION_EXPIRED',
          );
          refreshedOnUnauthorized = true;
          row = await refresh(latest, latest.token_box === row.token_box);
          continue;
        }
        if (failure(error, 401) || failure(error, 403)) await retire(row);
        throw error;
      }
    }
  }
  async function read(request: Request): Promise<AccountSession | null> {
    const value = await browser(request);
    if (!value || !['ACTIVE', 'REFRESHING'].includes(value.row.state))
      return null;
    return (await verified(value.row)).binding;
  }
  async function verifyCsrf(request: Request, binding: AccountSession) {
    const value = await browser(request),
      trusted = bindings.get(binding);
    if (
      !value ||
      !trusted ||
      value.row.id !== trusted.id ||
      value.row.epoch !== trusted.epoch
    )
      return false;
    await assertCurrent(binding);
    return cryptography.verifyCsrf(
      value.raw,
      request.headers.get('x-csrf-token'),
    );
  }
  async function readView(request: Request): Promise<AccountView> {
    const value = await browser(request, true);
    requireAccount(value);
    await csrf(request, value.raw);
    if (value.row.state === 'ANONYMOUS') {
      if (value.row.expires_at <= now()) {
        return { state: 'EXPIRED' };
      }
      return { state: 'ANONYMOUS' };
    }
    if (['EXPIRED', 'LOGGING_OUT'].includes(value.row.state))
      return { state: 'EXPIRED' };
    try {
      const { me } = await verified(value.row);
      return {
        state: 'AUTHENTICATED',
        user: me.user,
        session: me.session,
        capabilities: me.platformCapabilities,
      };
    } catch (error) {
      const latest = await store.get(value.row.id);
      if (
        !latest ||
        latest.state === 'EXPIRED' ||
        latest.state === 'LOGGING_OUT' ||
        failure(error, 401)
      )
        return { state: 'EXPIRED' };
      if (
        error instanceof AccountFailure &&
        error.envelope.error.code === 'UPSTREAM_UNAVAILABLE' &&
        latest.state === 'ACTIVE' &&
        latest.expires_at > now() &&
        latest.public_user
      ) {
        const user: unknown = JSON.parse(latest.public_user);
        if (validateNamed('UserView', user))
          return { state: 'OFFLINE_CACHED', user: user as UserView };
      }
      throw error;
    }
  }
  async function writeBrowser(request: Request) {
    requireAccount(
      request.headers.get('origin') === config.client.productOrigin &&
        !['cross-site', 'same-site'].includes(
          request.headers.get('sec-fetch-site') ?? '',
        ),
      403,
      'FORBIDDEN',
    );
    const value = await browser(request);
    requireAccount(
      value &&
        (await cryptography.verifyCsrf(
          value.raw,
          request.headers.get('x-csrf-token'),
        )),
      403,
      'FORBIDDEN',
    );
    return value;
  }
  /** Internal authentication orchestration only. No public token-install endpoint exists. */
  async function beginLogin(request: Request): Promise<LoginPermit> {
    const { row } = await writeBrowser(request);
    requireAccount(
      row.state === 'ANONYMOUS' || row.state === 'EXPIRED',
      409,
      'VERSION_CONFLICT',
    );
    const nonce = randomSessionSecret(),
      updated = await store.begin(
        row,
        await digestSessionSecret(nonce),
        now() + ANONYMOUS_MS,
      );
    requireAccount(updated, 409, 'VERSION_CONFLICT');
    return Object.freeze({ browserDigest: row.id, epoch: row.epoch, nonce });
  }
  async function permitRow(request: Request, permit: LoginPermit) {
    const value = await browser(request);
    requireAccount(
      value &&
        value.row.id === permit.browserDigest &&
        value.row.epoch === permit.epoch &&
        value.row.pending_nonce === (await digestSessionSecret(permit.nonce)) &&
        (value.row.pending_expires ?? 0) > now() &&
        ['ANONYMOUS', 'EXPIRED'].includes(value.row.state),
      409,
      'VERSION_CONFLICT',
    );
    return value.row;
  }
  async function completeLogin(
    request: Request,
    permit: LoginPermit,
    tokens: TokenSet,
  ): Promise<AccountView> {
    checkTokenSet(tokens);
    let committed: SessionRow | null = null,
      stagedId: string | undefined;
    try {
      const original = await permitRow(request, permit);
      requireAccount(
        !(await store.findLogin(tokens.session.loginSessionId)),
        409,
        'VERSION_CONFLICT',
      );
      const me = await client.identifyToken(
        tokens.accessToken,
        undefined,
        async () => {
          await permitRow(request, permit);
        },
      );
      requireAccount(
        me.session.loginSessionId === tokens.session.loginSessionId &&
          original.login_id !== tokens.session.loginSessionId,
        403,
        'POLICY_MISMATCH',
      );
      const raw = randomSessionSecret(),
        id = await digestSessionSecret(raw);
      stagedId = id;
      committed = await store.activate(
        original,
        await digestSessionSecret(permit.nonce),
        id,
        await stored(tokens, me, { id, epoch: original.epoch + 1 }),
        now(),
      );
      requireAccount(committed, 409, 'VERSION_CONFLICT');
      const { me: checked } = await verified(committed);
      setCookie(request, raw, Date.parse(checked.session.absoluteExpiresAt));
      await csrf(request, raw);
      return {
        state: 'AUTHENTICATED',
        user: checked.user,
        session: checked.session,
        capabilities: checked.platformCapabilities,
      };
    } catch (error) {
      const installed =
        committed ?? (stagedId ? await store.get(stagedId) : null);
      if (installed?.login_id === tokens.session.loginSessionId)
        await retire(installed);
      const existing = await store.findLogin(tokens.session.loginSessionId);
      // A duplicate result must not revoke a login that another completion already installed.
      // A new result arriving after cancellation/fencing has no owner and is revoked here.
      if (!existing || existing.id === stagedId) await revokeTokens(tokens);
      throw error;
    }
  }
  async function cancelLogin(request: Request, permit: LoginPermit) {
    await writeBrowser(request);
    const row = await permitRow(request, permit);
    requireAccount(
      await store.cancel(row, await digestSessionSecret(permit.nonce)),
      409,
      'VERSION_CONFLICT',
    );
  }
  async function activity(request: Request, input: ActivityRequest) {
    requireAccount(validateNamed('ActivityRequest', input));
    await writeBrowser(request);
    const binding = await read(request);
    requireAccount(binding, 401, 'SESSION_EXPIRED');
    const result = await client.call(
      'recordActivity',
      { body: input },
      {
        session: binding,
        signal: request.signal,
        assertCurrent: () => assertCurrent(binding),
      },
    );
    const row = await current(bindings.get(binding)!);
    requireAccount(row.public_session, 401, 'SESSION_EXPIRED');
    sameSession(result.data, JSON.parse(row.public_session) as SessionView);
    requireAccount(
      result.data.loginSessionId === row.login_id,
      403,
      'POLICY_MISMATCH',
    );
    await store.cache(
      row,
      row.public_user!,
      JSON.stringify(result.data),
      expiry(result.data),
    );
    await assertCurrent(binding);
    return result;
  }
  async function logout(
    request: Request,
    input: ProductLogoutRequest,
    key: string,
  ): Promise<ProductLogoutResult> {
    requireAccount(
      validateNamed('ProductLogoutRequest', input) &&
        key.length >= 16 &&
        key.length <= 128,
    );
    let { row } = await writeBrowser(request);
    if (row.logout_key === key) {
      requireAccount(row.logout_scope === input.scope, 409, 'VERSION_CONFLICT');
      return {
        localCleared: true,
        remoteRevocation: row.logout_result ?? 'UNCONFIRMED',
      };
    }
    requireAccount(row.state !== 'LOGGING_OUT', 409, 'VERSION_CONFLICT');
    const tokens = row.token_box ? await cryptography.open(row) : null;
    const cleared = await store.startLogout(
      row,
      key,
      input.scope,
      now() + 20_000,
    );
    requireAccount(cleared, 409, 'VERSION_CONFLICT'); // Never report localCleared if persistent fencing failed.
    row = cleared;
    let remote: ProductLogoutResult['remoteRevocation'] = 'UNCONFIRMED';
    if (tokens) {
      try {
        if (input.scope === 'CURRENT_LOGIN') {
          const result = await client.call('logoutCurrent', {
            body: {
              refreshProof: {
                clientId: config.client.clientId,
                refreshToken: tokens.refreshToken,
              },
            },
            idempotencyKey: key,
          });
          requireAccount(
            result.data.loginSessionId === row.login_id,
            503,
            'AUTH_UNAVAILABLE',
          );
        } else
          await client.call('logoutAll', {
            body: {
              refreshProof: {
                clientId: config.client.clientId,
                refreshToken: tokens.refreshToken,
              },
            },
            idempotencyKey: key,
          });
        remote = 'CONFIRMED';
      } catch {
        /* A network or authority failure is not confirmation of remote revocation. */
      }
    }
    await store.finishLogout(row, remote);
    return { localCleared: true, remoteRevocation: remote };
  }
  const sessions: AccountSessionPort = {
    read,
    verifyCsrf,
    assertCurrent,
    readView,
    activity,
    logout,
  };
  function decorate(request: Request, response: Response) {
    const result = new Response(response.body, response),
      extra = headers.get(request);
    extra?.forEach((value, name) => result.headers.set(name, value));
    result.headers.set('Cache-Control', 'no-store');
    result.headers.set('Vary', 'Cookie');
    return result;
  }
  return Object.freeze({
    sessions,
    async authenticationBinding(
      request: Request,
      previous?: TrustedBinding,
      readOnly = false,
    ) {
      const binding = await read(request);
      requireAccount(binding, 401, 'SESSION_EXPIRED');
      const identity = bindings.get(binding)!;
      if (previous)
        requireAccount(
          identity.id === previous.id &&
            identity.epoch === previous.epoch &&
            identity.userId === previous.userId &&
            identity.loginId === previous.loginId,
          403,
          'FORBIDDEN',
        );
      if (!readOnly)
        requireAccount(
          request.headers.get('origin') === config.client.productOrigin &&
            (await verifyCsrf(request, binding)),
          403,
          'FORBIDDEN',
        );
      return { binding, identity };
    },
    beginLogin,
    completeLogin,
    cancelLogin,
    assertLogin: async (
      request: Request,
      permit: LoginPermit,
      callback = false,
    ) => {
      if (!callback) await writeBrowser(request);
      await permitRow(request, permit);
    },
    decorate,
    cookieName,
  });
}
export type ClubSessionManager = Awaited<
  ReturnType<typeof createClubSessionManager>
>;
