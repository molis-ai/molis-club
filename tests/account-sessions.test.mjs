import test from 'node:test';
import assert from 'node:assert/strict';
import { createCentralAccountClient } from '../lib/account/client.ts';
import { createAccountBff } from '../lib/account/bff.ts';
import { createClubSessionManager } from '../lib/account/sessions.ts';
import { randomSessionSecret } from '../lib/account/session-crypto.ts';
import { validateNamed } from '../lib/account/contracts/validate.ts';
import {
  harness,
  login,
  browser,
  deferred,
  configuration,
} from './fixtures/account-sessions.mjs';

const requestId = () => crypto.randomUUID();
const logout = (
  b,
  h,
  scope = 'CURRENT_LOGIN',
  key = requestId(),
  owner = h.owner,
) =>
  b.call(owner, h.client, '/logout', {
    method: 'POST',
    headers: { 'Idempotency-Key': key },
    body: { scope },
  });
const state = async (b, h, owner = h.owner) =>
  (await (await b.call(owner, h.client, '/session')).json()).data;

void test('CLUB-02 UAS-26: anonymous Cookie/CSRF and encrypted server storage expose no central token', async (t) => {
  const h = await harness(t),
    b = browser();
  const anonymous = await b.call(h.owner, h.client, '/session');
  assert.deepEqual((await anonymous.json()).data, { state: 'ANONYMOUS' });
  assert.match(
    anonymous.headers.get('set-cookie'),
    /HttpOnly; SameSite=Lax; Max-Age=/,
  );
  assert.ok(!anonymous.headers.get('set-cookie').includes('Domain='));
  assert.ok(b.csrf.length >= 32);
  const oldCookie = b.cookie;
  const signed = await login(h, b);
  assert.notEqual(b.cookie, oldCookie, 'login rotates the browser bearer');
  const rows = JSON.stringify(
    h.db.sql.prepare('SELECT * FROM central_account_sessions').all(),
  );
  for (const secret of [
    signed.tokens.accessToken,
    signed.tokens.refreshToken,
    b.cookie.split('=')[1],
    h.key,
  ])
    assert.ok(!rows.includes(secret));
  const view = await state(b, h);
  assert.equal(view.state, 'AUTHENTICATED');
  assert.equal(validateNamed('AccountView', view), true);
  for (const secret of [
    signed.tokens.accessToken,
    signed.tokens.refreshToken,
    signed.permit.nonce,
  ])
    assert.ok(!JSON.stringify(view).includes(secret));
  const read = await b.call(h.owner, h.client, '/session');
  assert.equal(
    read.headers.get('set-cookie'),
    null,
    'background reads cannot overwrite a newer Cookie',
  );
});

void test('CLUB-02 UAS-11/26: login permits bind browser and epoch, are single-use, and old bindings cannot overwrite new login', async (t) => {
  const h = await harness(t),
    a = browser(),
    b = browser();
  await a.call(h.owner, h.client, '/session');
  await b.call(h.owner, h.client, '/session');
  const req = a.request('/auth/transactions', { method: 'POST' }),
    permit = await h.owner.beginLogin(req),
    tokens = h.auth.issue();
  await assert.rejects(
    h.owner.completeLogin(
      b.request(),
      permit,
      h.auth.issue('rejected-cross-browser'),
    ),
    /VERSION_CONFLICT/,
  );
  const result = await h.owner.completeLogin(req, permit, tokens);
  a.apply(h.owner.decorate(req, Response.json(result)));
  const binding = await h.owner.sessions.read(a.request());
  await assert.rejects(
    h.owner.completeLogin(req, permit, tokens),
    /VERSION_CONFLICT/,
  );
  assert.equal(
    (await state(a, h)).state,
    'AUTHENTICATED',
    'duplicate completion does not revoke the installed login',
  );
  await assert.rejects(h.owner.beginLogin(a.request()), /VERSION_CONFLICT/);
  await logout(a, h);
  const nextReq = a.request('/auth/transactions', { method: 'POST' }),
    nextPermit = await h.owner.beginLogin(nextReq);
  const second = h.auth.issue('different-user');
  const next = await h.owner.completeLogin(nextReq, nextPermit, second);
  a.apply(h.owner.decorate(nextReq, Response.json(next)));
  await assert.rejects(
    h.owner.sessions.assertCurrent(binding),
    /SESSION_EXPIRED/,
  );
  assert.equal((await state(a, h)).user.userId, 'different-user');
  await assert.rejects(
    h.owner.completeLogin(
      nextReq,
      { ...nextPermit, nonce: requestId() },
      second,
    ),
    /VERSION_CONFLICT/,
  );
});

void test('CLUB-02 UAS-38: restart recovers the same login, while reads and refresh never report activity', async (t) => {
  const h = await harness(t),
    { browser: b, tokens } = await login(h);
  const restarted = await h.make();
  assert.equal(
    (await state(b, h, restarted)).session.loginSessionId,
    tokens.session.loginSessionId,
  );
  assert.equal(h.auth.counts.activity, 0);
  h.db.sql
    .prepare('UPDATE central_account_sessions SET access_expires_at=0')
    .run();
  const after = await state(b, h, restarted);
  assert.equal(after.session.authenticatedAt, tokens.session.authenticatedAt);
  assert.equal(after.session.lastActiveAt, tokens.session.lastActiveAt);
  assert.equal(h.auth.counts.refresh, 1);
  assert.equal(h.auth.counts.activity, 0);
  const activity = await b.call(restarted, h.client, '/activity', {
    method: 'POST',
    body: { eventId: requestId(), kind: 'INTERACT' },
  });
  assert.equal(activity.status, 200);
  assert.equal(h.auth.counts.activity, 1);
  const session = (await activity.json()).data;
  assert.equal(session.authenticatedAt, tokens.session.authenticatedAt);
  assert.equal(activity.headers.get('set-cookie'), null);
});

void test('CLUB-02 UAS-26: two Worker instances use one D1 refresh lease and all readers use the committed rotation', async (t) => {
  const h = await harness(t),
    { browser: b } = await login(h),
    second = await h.make();
  h.db.sql
    .prepare('UPDATE central_account_sessions SET access_expires_at=0')
    .run();
  const entered = deferred(),
    release = deferred();
  h.auth.refreshGate = async () => {
    entered.resolve();
    await release.promise;
  };
  const first = state(b, h);
  await entered.promise;
  const stored = h.db.sql
    .prepare('SELECT state,token_box FROM central_account_sessions')
    .get();
  assert.equal(stored.state, 'REFRESHING');
  assert.equal(stored.token_box, null);
  const peers = Array.from({ length: 4 }, () => state(b, h, second));
  release.resolve();
  for (const result of await Promise.all([first, ...peers]))
    assert.equal(result.state, 'AUTHENTICATED');
  assert.equal(h.auth.counts.refresh, 1);
});

void test('CLUB-02 UAS-26: refresh response loss cannot reuse old refresh after restart', async (t) => {
  const h = await harness(t),
    { browser: b } = await login(h);
  h.db.sql
    .prepare('UPDATE central_account_sessions SET access_expires_at=0')
    .run();
  h.auth.refreshGate = async () => {
    throw new Error('response lost after Auth consumed refresh');
  };
  assert.equal((await state(b, h)).state, 'EXPIRED');
  assert.equal((await state(b, h, await h.make())).state, 'EXPIRED');
  const row = h.db.sql.prepare('SELECT * FROM central_account_sessions').get();
  assert.equal(row.token_box, null);
  assert.equal(h.auth.counts.refresh, 1);
});

void test('CLUB-02 UAS-09/26: expired refresh lease denies takeover and rejects a late successful refresh', async (t) => {
  let time = Date.now();
  const h = await harness(t, {
    now: () => time,
    refreshLeaseMs: 40,
    pause: async () => {
      time += 50;
    },
  });
  const { browser: b } = await login(h),
    second = await h.make();
  h.db.sql
    .prepare('UPDATE central_account_sessions SET access_expires_at=0')
    .run();
  const entered = deferred(),
    release = deferred();
  h.auth.refreshGate = async () => {
    entered.resolve();
    await release.promise;
  };
  const first = state(b, h);
  await entered.promise;
  assert.equal((await state(b, h, second)).state, 'EXPIRED');
  release.resolve();
  assert.equal((await first).state, 'EXPIRED');
  assert.equal(h.auth.counts.refresh, 1);
  assert.equal(
    h.db.sql.prepare('SELECT token_box FROM central_account_sessions').get()
      .token_box,
    null,
  );
});

void test('CLUB-02 UAS-09: logout fences an in-flight refresh and a later login remains independent', async (t) => {
  const h = await harness(t),
    { browser: b, tokens } = await login(h),
    second = await h.make();
  h.db.sql
    .prepare('UPDATE central_account_sessions SET access_expires_at=0')
    .run();
  const entered = deferred(),
    release = deferred();
  h.auth.refreshGate = async () => {
    entered.resolve();
    await release.promise;
  };
  const first = state(b, h);
  await entered.promise;
  const ended = await logout(b, h, 'CURRENT_LOGIN', requestId(), second);
  assert.deepEqual((await ended.json()).data, {
    localCleared: true,
    remoteRevocation: 'UNCONFIRMED',
  });
  assert.equal(
    ended.headers.get('set-cookie'),
    null,
    'late logout must not delete a newer Cookie',
  );
  h.auth.refreshGate = undefined;
  await login(h, b, h.auth.issue('new-user'));
  release.resolve();
  assert.equal((await first).state, 'EXPIRED');
  assert.equal((await state(b, h)).user.userId, 'new-user');
  assert.equal(
    h.auth.sessions.get(tokens.session.loginSessionId).revoked,
    true,
  );
});

void test('CLUB-02 UAS-09/10: current logout preserves independent browser, all-products logout revokes it', async (t) => {
  const h = await harness(t),
    a = (await login(h)).browser,
    b = (await login(h)).browser;
  assert.deepEqual((await (await logout(a, h)).json()).data, {
    localCleared: true,
    remoteRevocation: 'CONFIRMED',
  });
  assert.equal((await state(a, h)).state, 'EXPIRED');
  assert.equal((await state(b, h)).state, 'AUTHENTICATED');
  await login(h, a);
  const key = requestId();
  assert.equal(
    (await (await logout(a, h, 'ALL_MOLIS_PRODUCTS', key)).json()).data
      .remoteRevocation,
    'CONFIRMED',
  );
  assert.equal((await state(b, h, await h.make())).state, 'EXPIRED');
  assert.equal(
    (await (await logout(a, h, 'ALL_MOLIS_PRODUCTS', key)).json()).data
      .remoteRevocation,
    'CONFIRMED',
  );
});

void test('CLUB-02 UAS-38: early access-token rejection refreshes once, global revocation expires recovery', async (t) => {
  const h = await harness(t),
    { browser: b, tokens } = await login(h);
  h.auth.sessions.get(tokens.session.loginSessionId).accessRejected = true;
  assert.equal((await state(b, h)).state, 'AUTHENTICATED');
  assert.equal(h.auth.counts.refresh, 1);
  h.auth.sessions.get(tokens.session.loginSessionId).revoked = true;
  assert.equal((await state(b, h, await h.make())).state, 'EXPIRED');
  assert.equal(
    h.db.sql.prepare('SELECT token_box FROM central_account_sessions').get()
      .token_box,
    null,
  );
});

void test('CLUB-02 UAS-38: offline view is only a cache and both idle and absolute expiry stop recovery', async (t) => {
  let time = Date.now();
  const h = await harness(t, { now: () => time }),
    { browser: b, tokens } = await login(h);
  h.auth.offline = true;
  const offline = await state(b, h);
  assert.equal(offline.state, 'OFFLINE_CACHED');
  assert.equal(offline.session, undefined);
  await assert.rejects(
    h.owner.sessions.read(b.request()),
    /UPSTREAM_UNAVAILABLE/,
  );
  h.auth.offline = false;
  time = Date.parse(tokens.session.idleExpiresAt) + 1;
  assert.equal((await state(b, h)).state, 'EXPIRED');
  assert.equal(h.auth.counts.refresh, 0);
  const second = await harness(t);
  const signed = await login(second);
  const beyond = await second.make({
    now: () => Date.parse(signed.tokens.session.absoluteExpiresAt) + 1,
  });
  assert.equal((await state(signed.browser, second, beyond)).state, 'EXPIRED');
});

void test('CLUB-02 UAS-26: cross-site, wrong CSRF, duplicate Cookie and forged browser bearer are refused', async (t) => {
  const h = await harness(t),
    { browser: b } = await login(h);
  for (const headers of [
    { Origin: 'https://outside.test' },
    { 'X-CSRF-Token': requestId() },
    { 'Sec-Fetch-Site': 'cross-site' },
    { Cookie: b.cookie + '; ' + b.cookie },
    { Authorization: 'Bearer ' + requestId() },
  ]) {
    const response = await b.call(h.owner, h.client, '/logout', {
      method: 'POST',
      body: { scope: 'CURRENT_LOGIN' },
      headers: { 'Idempotency-Key': requestId(), ...headers },
    });
    assert.ok([400, 403].includes(response.status));
  }
  assert.equal(h.auth.counts.logout, 0);
  assert.equal((await state(b, h)).state, 'AUTHENTICATED');
});

void test('CLUB-02 UAS-26: failed logout persistence never claims local clearing; failed refresh commit never restores old tokens', async (t) => {
  const h = await harness(t),
    { browser: b } = await login(h);
  h.db.fail = (sql) => sql.includes("state='LOGGING_OUT'");
  const denied = await logout(b, h);
  assert.equal(denied.status, 503);
  assert.equal((await denied.json()).data, undefined);
  assert.equal(h.auth.counts.logout, 0);
  h.db.fail = undefined;
  assert.equal((await state(b, h)).state, 'AUTHENTICATED');
  h.db.sql
    .prepare('UPDATE central_account_sessions SET access_expires_at=0')
    .run();
  h.db.fail = (sql) => sql.includes("SET state='ACTIVE',token_box");
  const failed = await b.call(h.owner, h.client, '/session');
  assert.ok([200, 503].includes(failed.status));
  h.db.fail = undefined;
  assert.equal((await state(b, h, await h.make())).state, 'EXPIRED');
  assert.equal(
    h.db.sql.prepare('SELECT token_box FROM central_account_sessions').get()
      .token_box,
    null,
  );
});

void test('CLUB-02 UAS-11: cancelled or fenced authentication cannot install credentials after logout', async (t) => {
  const h = await harness(t),
    b = browser();
  await b.call(h.owner, h.client, '/session');
  const request = b.request('/auth/transactions', { method: 'POST' }),
    permit = await h.owner.beginLogin(request);
  await h.owner.cancelLogin(request, permit);
  await assert.rejects(
    h.owner.completeLogin(request, permit, h.auth.issue()),
    /VERSION_CONFLICT/,
  );
  const second = await h.owner.beginLogin(request),
    entered = deferred(),
    release = deferred();
  h.auth.meGate = async () => {
    entered.resolve();
    await release.promise;
  };
  const installing = h.owner.completeLogin(request, second, h.auth.issue());
  const rejected = assert.rejects(installing, /VERSION_CONFLICT/);
  await entered.promise;
  await logout(b, h);
  h.auth.meGate = undefined;
  release.resolve();
  await rejected;
  assert.equal((await state(b, h)).state, 'EXPIRED');
});

void test('CLUB-02 UAS-11/26: encryption key, origin and client binding never silently adopt another configuration', async (t) => {
  const h = await harness(t),
    { browser: b } = await login(h);
  await assert.rejects(
    h.make({ encryptionKey: undefined }),
    /UNIFIED_CONFIGURATION_INVALID/,
  );
  const wrongKey = await h.make({ encryptionKey: randomSessionSecret() });
  const response = await b.call(wrongKey, h.client, '/session');
  assert.equal(response.status, 503);
  assert.equal(
    (await response.json()).error.code,
    'UNIFIED_CONFIGURATION_INVALID',
  );
  await assert.rejects(
    wrongKey.sessions.read(b.request()),
    /UNIFIED_CONFIGURATION_INVALID/,
  );
  const cfg = configuration();
  const different = {
    ...cfg,
    client: { ...cfg.client, environmentId: 'different-environment' },
  };
  const client = createCentralAccountClient(different, (req) =>
    h.auth.send(req),
  );
  const isolated = await createClubSessionManager({
    db: h.db,
    client,
    encryptionKey: h.key,
  });
  const request = b.request();
  const fresh = isolated.decorate(
    request,
    await createAccountBff(client, isolated.sessions)(request),
  );
  assert.equal((await fresh.json()).data.state, 'ANONYMOUS');
});

void test('CLUB-02 UAS-26: a forced refresh losing CAS to a completed rotation does not rotate again', async (t) => {
  const h = await harness(t),
    signed = await login(h),
    b = signed.browser;
  const second = await h.make(),
    entered = deferred(),
    release = deferred();
  h.auth.sessions.get(signed.tokens.session.loginSessionId).accessRejected =
    true;
  let claim = 0;
  h.db.before = async (sql) => {
    if (sql.includes("SET state='REFRESHING'") && ++claim === 1) {
      entered.resolve();
      await release.promise;
    }
  };
  const slow = state(b, h);
  await entered.promise;
  assert.equal((await state(b, h, second)).state, 'AUTHENTICATED');
  release.resolve();
  assert.equal((await slow).state, 'AUTHENTICATED');
  assert.equal(h.auth.counts.refresh, 1);
});

void test('CLUB-02 UAS-38: immutable session anchors cannot be extended by a mismatched identity or refresh response', async (t) => {
  for (const field of ['authenticatedAt', 'absoluteExpiresAt']) {
    const h = await harness(t),
      signed = await login(h);
    const family = h.auth.sessions.get(signed.tokens.session.loginSessionId);
    family.session[field] = new Date(
      Date.parse(family.session[field]) + 86400000,
    ).toISOString();
    await assert.rejects(
      h.owner.sessions.read(signed.browser.request()),
      /POLICY_MISMATCH/,
    );
    assert.equal((await state(signed.browser, h)).state, 'EXPIRED');
  }
  const h = await harness(t),
    signed = await login(h);
  h.db.sql
    .prepare('UPDATE central_account_sessions SET access_expires_at=0')
    .run();
  h.auth.refreshGate = async (tokens) => {
    tokens.session.absoluteExpiresAt = new Date(
      Date.parse(tokens.session.absoluteExpiresAt) + 86400000,
    ).toISOString();
  };
  assert.equal((await state(signed.browser, h)).state, 'EXPIRED');
  assert.equal(
    h.auth.sessions.get(signed.tokens.session.loginSessionId).revoked,
    true,
  );
});

void test('CLUB-02 UAS-26: login commit response loss revokes the new session and leaves no recoverable tokens', async (t) => {
  const h = await harness(t),
    b = browser();
  await b.call(h.owner, h.client, '/session');
  const req = b.request('/auth/transactions', { method: 'POST' }),
    permit = await h.owner.beginLogin(req),
    tokens = h.auth.issue();
  h.db.failAfter = (sql) => sql.includes("SET id=?,state='ACTIVE'");
  await assert.rejects(
    h.owner.completeLogin(req, permit, tokens),
    /response loss/,
  );
  h.db.failAfter = undefined;
  assert.equal(
    h.auth.sessions.get(tokens.session.loginSessionId).revoked,
    true,
  );
  assert.equal(
    h.db.sql
      .prepare(
        'SELECT count(*) AS n FROM central_account_sessions WHERE token_box IS NOT NULL',
      )
      .get().n,
    0,
  );
  assert.equal(
    h.owner.decorate(req, Response.json({})).headers.get('set-cookie'),
    null,
  );
});

void test('CLUB-02 UAS-09/10: global logout blocks new login until settled and offline logout reports unconfirmed', async (t) => {
  const h = await harness(t),
    { browser: b } = await login(h),
    entered = deferred(),
    release = deferred();
  h.auth.logoutGate = async () => {
    entered.resolve();
    await release.promise;
  };
  const ending = logout(b, h, 'ALL_MOLIS_PRODUCTS');
  await entered.promise;
  await assert.rejects(h.owner.beginLogin(b.request()), /VERSION_CONFLICT/);
  assert.equal((await state(b, h)).state, 'EXPIRED');
  release.resolve();
  assert.equal(
    (await (await ending).json()).data.remoteRevocation,
    'CONFIRMED',
  );
  h.auth.logoutGate = undefined;
  await login(h, b);
  h.auth.offline = true;
  assert.deepEqual((await (await logout(b, h)).json()).data, {
    localCleared: true,
    remoteRevocation: 'UNCONFIRMED',
  });
  assert.equal((await state(b, h, await h.make())).state, 'EXPIRED');
  assert.equal(
    h.db.sql.prepare('SELECT token_box FROM central_account_sessions').get()
      .token_box,
    null,
  );
});

void test('CLUB-02 UAS-38: browser login Cookie has the fixed absolute deadline and activity cannot rewrite it', async (t) => {
  const h = await harness(t),
    b = browser();
  await b.call(h.owner, h.client, '/session');
  const req = b.request('/auth/transactions', { method: 'POST' }),
    permit = await h.owner.beginLogin(req),
    tokens = h.auth.issue();
  const view = await h.owner.completeLogin(req, permit, tokens);
  const response = h.owner.decorate(req, Response.json(view));
  b.apply(response);
  assert.ok(
    response.headers
      .get('set-cookie')
      .includes(
        'Expires=' + new Date(tokens.session.absoluteExpiresAt).toUTCString(),
      ),
  );
  assert.ok(
    !response.headers
      .get('set-cookie')
      .includes(
        'Expires=' + new Date(tokens.session.idleExpiresAt).toUTCString(),
      ),
  );
  const active = await b.call(h.owner, h.client, '/activity', {
    method: 'POST',
    body: { kind: 'OPEN', eventId: requestId() },
  });
  assert.equal(active.status, 200);
  assert.equal(active.headers.get('set-cookie'), null);
});

void test('CLUB-02 UAS-38: same-revision late activity cannot roll back persisted activity and an active login survives the original idle deadline', async (t) => {
  let time = Date.now();
  const h = await harness(t, { now: () => time }),
    signed = await login(h),
    b = signed.browser;
  h.auth.time = () => time;
  const entered = deferred(),
    release = deferred();
  let activity = 0;
  h.auth.activityGate = async () => {
    if (++activity === 1) {
      entered.resolve();
      await release.promise;
    }
  };
  const first = b.call(h.owner, h.client, '/activity', {
    method: 'POST',
    body: { kind: 'INTERACT', eventId: requestId() },
  });
  await entered.promise;
  time += 86400000;
  const second = await b.call(await h.make(), h.client, '/activity', {
    method: 'POST',
    body: { kind: 'INTERACT', eventId: requestId() },
  });
  assert.equal(second.status, 200);
  const latest = (await second.json()).data;
  release.resolve();
  assert.equal((await first).status, 200);
  const stored = JSON.parse(
    h.db.sql
      .prepare('SELECT public_session FROM central_account_sessions')
      .get().public_session,
  );
  assert.equal(stored.sessionRevision, 0);
  assert.equal(stored.lastActiveAt, latest.lastActiveAt);
  assert.equal(stored.idleExpiresAt, latest.idleExpiresAt);
  // Central activity has extended this login, even though its encrypted original TokenSet is older.
  time = Date.parse(signed.tokens.session.idleExpiresAt) + 1;
  assert.equal((await state(b, h, await h.make())).state, 'AUTHENTICATED');
});

void test('CLUB-02 UAS-09/26: an interrupted durable logout becomes re-loginable after its lease without restoring tokens', async (t) => {
  for (const mode of ['commit-response-lost', 'finish-write-failed']) {
    let time = Date.now();
    const h = await harness(t, { now: () => time }),
      signed = await login(h),
      b = signed.browser;
    if (mode === 'commit-response-lost')
      h.db.failAfter = (sql) => sql.includes("SET state='LOGGING_OUT'");
    else
      h.db.fail = (sql) => sql.includes("SET state='EXPIRED',logout_result=?");
    const key = requestId(),
      result = await logout(b, h, 'CURRENT_LOGIN', key);
    assert.equal(result.status, 503);
    h.db.fail = undefined;
    h.db.failAfter = undefined;
    const stored = h.db.sql
      .prepare('SELECT state,token_box FROM central_account_sessions')
      .get();
    assert.equal(stored.state, 'LOGGING_OUT');
    assert.equal(stored.token_box, null);
    await assert.rejects(h.owner.beginLogin(b.request()), /VERSION_CONFLICT/);
    time += 21_000;
    const restarted = await h.make();
    assert.equal((await state(b, h, restarted)).state, 'EXPIRED');
    assert.deepEqual(
      (await (await logout(b, h, 'CURRENT_LOGIN', key, restarted)).json()).data,
      { localCleared: true, remoteRevocation: 'UNCONFIRMED' },
    );
    await login(h, b, h.auth.issue('replacement'));
    assert.equal((await state(b, h, restarted)).user.userId, 'replacement');
  }
});

void test('CLUB-02 UAS-09/10: a late global logout response cannot expire logins created after central revocation', async (t) => {
  let time = Date.now();
  const h = await harness(t, { now: () => time }),
    signed = await login(h),
    a = signed.browser;
  const entered = deferred(),
    release = deferred();
  h.auth.logoutResponseGate = async () => {
    entered.resolve();
    await release.promise;
  };
  const ending = logout(a, h, 'ALL_MOLIS_PRODUCTS');
  await entered.promise;
  const other = (await login(h)).browser;
  time += 21_000;
  await login(h, a);
  release.resolve();
  const result = await ending;
  assert.equal((await result.json()).data.remoteRevocation, 'CONFIRMED');
  assert.equal(result.headers.get('set-cookie'), null);
  assert.equal((await state(a, h)).state, 'AUTHENTICATED');
  assert.equal((await state(other, h, await h.make())).state, 'AUTHENTICATED');
});

void test('CLUB-02 UAS-11: cancelled completion revokes only its newly issued session, while installed replay is harmless', async (t) => {
  const h = await harness(t),
    b = browser();
  await b.call(h.owner, h.client, '/session');
  const request = b.request('/auth/transactions', { method: 'POST' }),
    permit = await h.owner.beginLogin(request),
    orphan = h.auth.issue();
  await h.owner.cancelLogin(request, permit);
  const signed = await login(h, b);
  await assert.rejects(
    h.owner.completeLogin(request, permit, orphan),
    /VERSION_CONFLICT/,
  );
  assert.equal(
    h.auth.sessions.get(orphan.session.loginSessionId).revoked,
    true,
  );
  assert.equal(
    h.auth.sessions.get(signed.tokens.session.loginSessionId).revoked,
    false,
  );
  await assert.rejects(
    h.owner.completeLogin(signed.request, signed.permit, signed.tokens),
    /VERSION_CONFLICT/,
  );
  assert.equal((await state(b, h)).state, 'AUTHENTICATED');
});

void test('ENV-12/13: returning to the same Club origin cannot restore an earlier generation', async (t) => {
  const h = await harness(t);
  const { browser: b } = await login(h);
  const config = { ...configuration(), generation: crypto.randomUUID() };
  const client = createCentralAccountClient(config, request => h.auth.send(request));
  const afterSwitch = await createClubSessionManager({ db: h.db, client, encryptionKey: h.key });
  const request = b.request();
  assert.equal(await afterSwitch.sessions.read(request), null);
  const response = await createAccountBff(client, afterSwitch.sessions)(request);
  assert.equal((await response.json()).data.state, 'ANONYMOUS');
});
