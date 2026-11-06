import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { readClubAccountConfig } from '../../lib/account/config.ts';
import { createCentralAccountClient } from '../../lib/account/client.ts';
import { createClubSessionManager } from '../../lib/account/sessions.ts';
import { createAccountBff } from '../../lib/account/bff.ts';
import { randomSessionSecret } from '../../lib/account/session-crypto.ts';

export const configuration = () =>
  readClubAccountConfig(
    JSON.stringify({
      applicationId: 'molis-club-unified-local-app',
      redirectUri: 'http://127.0.0.1:3000/account/callback',
      client: {
        environmentId: 'unified-local',
        environmentKind: 'LOCAL',
        authOrigin: 'http://127.0.0.1:8787',
        productOrigin: 'http://127.0.0.1:3000',
        clientId: 'molis-club-unified-local',
        policyProfile: 'unified-account-v2',
        redirectAllowlist: ['http://127.0.0.1:3000/account/callback'],
        deliveryMode: 'MOCK',
        providerMode: 'MOCK',
      },
    }),
  );
export function database(t) {
  const sql = new DatabaseSync(':memory:');
  sql.exec(
    readFileSync(
      new URL(
        '../../drizzle/0004_central_account_sessions.sql',
        import.meta.url,
      ),
      'utf8',
    ),
  );
  t.after(() => sql.close());
  const db = {
    sql,
    fail: undefined,
    failAfter: undefined,
    before: undefined,
    prepare(query) {
      return {
        bind(...values) {
          return {
            async first() {
              if (db.before) await db.before(query, values);
              if (db.fail?.(query))
                throw new Error('injected database refusal');
              const row = sql.prepare(query).get(...values) ?? null;
              if (db.failAfter?.(query))
                throw new Error('injected response loss after commit');
              return row;
            },
            async run() {
              if (db.fail?.(query))
                throw new Error('injected database refusal');
              return sql.prepare(query).run(...values);
            },
          };
        },
      };
    },
  };
  return db;
}
const envelope = (data) =>
  Response.json({ data, requestId: crypto.randomUUID() });
const expired = () =>
  Response.json(
    { requestId: crypto.randomUUID(), error: { code: 'SESSION_EXPIRED' } },
    { status: 401 },
  );
export function fakeAuth() {
  const cfg = configuration();
  const sessions = new Map(),
    accesses = new Map(),
    refreshes = new Map();
  const counts = { refresh: 0, activity: 0, reads: 0, logout: 0 };
  const api = {
    counts,
    sessions,
    offline: false,
    time: () => Date.now(),
    refreshGate: undefined,
    activityGate: undefined,
    meGate: undefined,
    logoutGate: undefined,
    logoutResponseGate: undefined,
    issue(userId = 'same-user') {
      const time = api.time();
      const family = {
        userId,
        revoked: false,
        session: {
          loginSessionId: crypto.randomUUID(),
          applicationId: cfg.applicationId,
          clientId: cfg.client.clientId,
          authenticatedAt: new Date(time).toISOString(),
          lastActiveAt: new Date(time).toISOString(),
          idleExpiresAt: new Date(time + 30 * 86400000).toISOString(),
          absoluteExpiresAt: new Date(time + 90 * 86400000).toISOString(),
          sessionRevision: 0,
        },
      };
      sessions.set(family.session.loginSessionId, family);
      return rotate(family);
    },
    async send(request) {
      if (api.offline) throw new Error('isolated upstream unavailable');
      const path = new URL(request.url).pathname;
      const body = request.method === 'GET' ? undefined : await request.json();
      if (path.endsWith('/auth/token')) {
        counts.refresh++;
        const entry = refreshes.get(body.refreshToken);
        if (
          !entry ||
          entry.used ||
          entry.family.revoked ||
          body.clientId !== cfg.client.clientId
        )
          return expired();
        entry.used = true;
        const tokens = rotate(entry.family);
        if (api.refreshGate) await api.refreshGate(tokens);
        return envelope(tokens);
      }
      if (path.endsWith('/logout') || path.endsWith('/logout-all')) {
        counts.logout++;
        if (api.logoutGate) await api.logoutGate();
        const entry = refreshes.get(body?.refreshProof?.refreshToken);
        if (!entry) return expired();
        if (path.endsWith('/logout-all')) {
          if (entry.family.revoked) return expired();
          for (const family of sessions.values())
            if (family.userId === entry.family.userId) family.revoked = true;
          if (api.logoutResponseGate) await api.logoutResponseGate();
          return envelope({
            revokedScope: 'ALL_MOLIS_PRODUCTS',
            status: 'REVOKED',
          });
        }
        const ended = entry.family.revoked;
        entry.family.revoked = true;
        if (api.logoutResponseGate) await api.logoutResponseGate();
        return envelope({
          revokedScope: 'CURRENT_LOGIN',
          status: ended ? 'ALREADY_ENDED' : 'REVOKED',
          loginSessionId: entry.family.session.loginSessionId,
        });
      }
      const family = accesses.get(
        request.headers.get('authorization')?.slice(7),
      );
      if (!family || family.revoked || family.accessRejected) return expired();
      if (path.endsWith('/users/me')) {
        counts.reads++;
        if (api.meGate) await api.meGate(family);
        return envelope({
          user: {
            issuer: cfg.client.authOrigin,
            userId: family.userId,
            displayName: 'Session User',
            avatarUrl: null,
            version: 0,
          },
          session: family.session,
          loginMethods: [],
          passwordEnabled: false,
          platformCapabilities: [],
        });
      }
      if (path.endsWith('/activity')) {
        counts.activity++;
        const last = api.time() + 1000;
        family.session = {
          ...family.session,
          lastActiveAt: new Date(last).toISOString(),
          idleExpiresAt: new Date(
            Math.min(
              last + 30 * 86400000,
              Date.parse(family.session.absoluteExpiresAt),
            ),
          ).toISOString(),
          sessionRevision: family.session.sessionRevision,
        };
        const snapshot = { ...family.session };
        if (api.activityGate) await api.activityGate(family);
        return envelope(snapshot);
      }
      throw new Error('unexpected fixed operation: ' + path);
    },
  };
  function rotate(family) {
    family.accessRejected = false;
    const accessToken = randomSessionSecret(),
      refreshToken = randomSessionSecret();
    accesses.set(accessToken, family);
    refreshes.set(refreshToken, { family, used: false });
    return {
      tokenType: 'Bearer',
      accessToken,
      refreshToken,
      accessExpiresAt: new Date(api.time() + 3600000).toISOString(),
      session: { ...family.session },
    };
  }
  return api;
}
export function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
export function browser() {
  return {
    cookie: '',
    csrf: '',
    request(path = '/session', options = {}) {
      return new Request('http://127.0.0.1:3000/api/account' + path, {
        method: options.method ?? 'GET',
        headers: {
          Cookie: this.cookie,
          Origin: 'http://127.0.0.1:3000',
          'X-CSRF-Token': this.csrf,
          ...(options.body === undefined
            ? {}
            : { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
        ...(options.body === undefined
          ? {}
          : { body: JSON.stringify(options.body) }),
      });
    },
    apply(response) {
      const cookie = response.headers.get('set-cookie');
      if (cookie) this.cookie = cookie.split(';')[0];
      this.csrf = response.headers.get('x-csrf-token') ?? this.csrf;
      return response;
    },
    async call(owner, client, path, options) {
      const request = this.request(path, options);
      return this.apply(
        owner.decorate(
          request,
          await createAccountBff(client, owner.sessions)(request),
        ),
      );
    },
  };
}
export async function harness(t, options = {}) {
  const db = database(t),
    auth = fakeAuth(),
    client = createCentralAccountClient(configuration(), (request) =>
      auth.send(request),
    );
  const key = randomSessionSecret();
  const make = (extra = {}) =>
    createClubSessionManager({
      db,
      client,
      encryptionKey: key,
      ...options,
      ...extra,
    });
  const owner = await make();
  return { db, auth, client, key, owner, make };
}
export async function login(h, b = browser(), tokens = h.auth.issue()) {
  await b.call(h.owner, h.client, '/session');
  const request = b.request('/auth/transactions', { method: 'POST', body: {} });
  const permit = await h.owner.beginLogin(request);
  const view = await h.owner.completeLogin(request, permit, tokens);
  b.apply(h.owner.decorate(request, envelope(view)));
  return { browser: b, tokens, permit, request };
}
