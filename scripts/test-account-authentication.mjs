// CLUB-03 UAS-01/02/03/04/05/11/28/39/40/41: real Auth, fresh BFF per request, disposable D1.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { randomBytes, createHash } from 'node:crypto';
import { createCentralAccountClient } from '../lib/account/client.ts';
import { createClubSessionManager } from '../lib/account/sessions.ts';
import { createAuthenticationHandler } from '../lib/account/auth-http.ts';
import { createAccountBff } from '../lib/account/bff.ts';
import { browser, configuration } from '../tests/fixtures/account-sessions.mjs';
const source = process.env.MOLIS_AUTH_SOURCE;
assert.ok(source && isAbsolute(source));
const { getRustProxy, initializeLocalRuntime } = await import(
  pathToFileURL(resolve(source, 'worker/scripts/local-runtime.mjs')).href
);
const authOrigin = 'http://127.0.0.1:8787',
  productOrigin = 'http://127.0.0.1:3000';
const proxy = await getRustProxy({
  AUTH_ORIGIN: authOrigin,
  PROVIDER_STATE_KEY: randomBytes(32).toString('base64url'),
  UNIFIED_ACCOUNT_CONFIG: JSON.stringify({
    environmentId: 'unified-local',
    kind: 'LOCAL',
    authOrigin,
    providerMode: 'MOCK',
    deliveryMode: 'MOCK',
  }),
});
const key = randomBytes(32).toString('base64url'),
  b = browser(),
  db = proxy.env.DB,
  transport = createCentralAccountClient(configuration(), (request) => {
    if (new URL(request.url).pathname.endsWith('/login-methods/bind'))
      bindCalls++;
    return proxy.fetch(request);
  }),
  client = {
    ...transport,
    call: async (...args) => {
      if (args[0] === 'bindMethod' && beforeBind) {
        const run = beforeBind;
        beforeBind = null;
        await run();
      }
      return transport.call(...args);
    },
  };
let beforeBind = null,
  bindCalls = 0;
const secrets = [];
async function raw(request) {
  const owner = await createClubSessionManager({
    db,
    client,
    encryptionKey: key,
  });
  return new URL(request.url).pathname.includes('/auth/') ||
    new URL(request.url).pathname.endsWith('/password/reset') ||
    /\/(reauthentications|password\/change|login-methods\/(?:bind|[^/]+\/(?:replace|unlink)))$/.test(
      new URL(request.url).pathname,
    )
    ? createAuthenticationHandler(db, client, owner, key)(request)
    : owner.decorate(
        request,
        await createAccountBff(client, owner.sessions)(request),
      );
}
async function api(path, body, status = 200, headers = {}, who = b) {
  const response = who.apply(
    await raw(
      who.request(path, {
        method: body === undefined ? 'GET' : 'POST',
        body,
        headers,
      }),
    ),
  );
  const text = await response.text();
  assert.equal(response.status, status, text);
  for (const s of secrets)
    assert.ok(
      !text.includes(s),
      'No proof/password/code/Token in product response',
    );
  return JSON.parse(text).data;
}
const create = (purpose, method) =>
  api('/auth/transactions', { purpose, method });
const step = (tx, body, status = 200) =>
  api('/auth/transactions/' + tx.handle + '/submit', body, status);
const end = () =>
  api('/logout', { scope: 'CURRENT_LOGIN' }, 200, {
    'Idempotency-Key': crypto.randomUUID(),
  });
const code = async (target) =>
  (
    await db
      .prepare(
        'SELECT m.credential FROM auth_mock_delivery m JOIN auth_verification_challenge c ON c.delivery_id=m.delivery_id WHERE c.canonical_target=? ORDER BY c.created_at DESC LIMIT 1',
      )
      .bind(target)
      .first()
  ).credential;
async function verify(tx, target) {
  // Isolated fixture advances only this target's resend clock; production throttles remain enabled.
  await db
    .prepare('UPDATE auth_rate_bucket SET expires_at=0 WHERE bucket_hash=?')
    .bind(
      createHash('sha256')
        .update(
          'v2-delivery-resend:' +
            (target.startsWith('+') ? 'SMS:' : 'EMAIL:') +
            target,
        )
        .digest('hex'),
    )
    .run();
  const sent = await step(tx, { step: 'REQUEST_CHALLENGE', address: target });
  const credential = await code(target);
  secrets.push(credential);
  await step(
    tx,
    {
      step: 'VERIFY_CHALLENGE',
      challengeHandle: sent.challengeHandle,
      credential: '000000',
    },
    401,
  );
  return step(tx, {
    step: 'VERIFY_CHALLENGE',
    challengeHandle: sent.challengeHandle,
    credential,
  });
}
async function provider(
  method,
  outcome = 'SUCCESS',
  account = 'mock-' + method.toLowerCase() + '-local',
  existing,
) {
  const tx = existing ?? (await create('LOGIN', method)),
    started = await step(tx, { step: 'START_PROVIDER' });
  const start = await proxy.fetch(new Request(started.browserStartUrl));
  assert.equal(start.status, 303);
  const cookie = start.headers.get('set-cookie').split(';')[0],
    authorize = start.headers.get('location');
  const html = await (
    await proxy.fetch(new Request(authorize, { headers: { Cookie: cookie } }))
  ).text();
  const csrf = html.match(/name="csrf" value="([^"]+)"/)[1];
  assert.match(html, /仅用于隔离测试/);
  const granted = await proxy.fetch(
    new Request(
      authOrigin + '/api/v2/auth/mock/' + method.toLowerCase() + '/authorize',
      {
        method: 'POST',
        headers: {
          Cookie: cookie,
          Origin: authOrigin,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          state: new URL(authorize).searchParams.get('state'),
          csrf,
          accountId: account,
          outcome,
        }),
      },
    ),
  );
  assert.equal(granted.status, 303);
  const returned = await proxy.fetch(
    new Request(granted.headers.get('location'), {
      headers: { Cookie: cookie },
    }),
  );
  assert.equal(returned.status, 303);
  const url = new URL(returned.headers.get('location'));
  assert.equal(url.origin, productOrigin);
  return { tx, query: url.search };
}
try {
  await initializeLocalRuntime(proxy);
  for (const path of [
    resolve(source, 'worker/unified-account-local-seed.sql'),
    resolve(source, 'worker/mock-provider-local-seed.sql'),
    new URL('../drizzle/0004_central_account_sessions.sql', import.meta.url),
    new URL(
      '../drizzle/0005_central_account_transactions.sql',
      import.meta.url,
    ),
  ])
    for (const sql of readFileSync(path, 'utf8')
      .replace(/--[^\n]*/g, '')
      .split(';')
      .map((v) => v.trim())
      .filter(Boolean))
      await db.prepare(sql).run();
  await api('/session');
  const anonymousCookie = b.cookie;
  await api(
    '/auth/transactions',
    { purpose: 'LOGIN', method: 'EMAIL_PASSWORD' },
    403,
    { 'X-CSRF-Token': '' },
  );
  let tx = await create('EMAIL_SIGNUP', 'EMAIL_CODE');
  const email = 'club03@example.test',
    password = randomBytes(20).toString('base64url');
  secrets.push(password);
  const attacker = browser();
  await api('/session', undefined, 200, {}, attacker);
  await api('/auth/transactions/' + tx.handle, undefined, 409, {}, attacker);
  await verify(tx, email);
  await step(tx, { step: 'EMAIL_SIGNUP', email, password });
  const result = await step(tx, { step: 'COMPLETE' });
  assert.equal(result.account.state, 'AUTHENTICATED');
  assert.notEqual(b.cookie, anonymousCookie);
  const user = result.account.user.userId;
  await end();
  tx = await create('LOGIN', 'EMAIL_PASSWORD');
  await step(
    tx,
    { step: 'PASSWORD_LOGIN', email, password: 'invalid-password' },
    401,
  );
  await step(tx, { step: 'PASSWORD_LOGIN', email, password });
  assert.equal(
    (await step(tx, { step: 'COMPLETE' })).account.user.userId,
    user,
  );
  await end();
  tx = await create('LOGIN', 'PHONE_OTP');
  await verify(tx, '+8613800000604');
  await step(tx, { step: 'PHONE_LOGIN' });
  assert.equal(
    (await step(tx, { step: 'COMPLETE' })).account.state,
    'AUTHENTICATED',
  );
  await end();
  // Advance only this synthetic email's resend cooldown; production limit checks stay enabled.
  await db
    .prepare('UPDATE auth_rate_bucket SET expires_at=0 WHERE bucket_hash=?')
    .bind(
      createHash('sha256')
        .update('v2-delivery-resend:EMAIL:' + email)
        .digest('hex'),
    )
    .run();
  tx = await create('PASSWORD_RESET', 'EMAIL_CODE');
  await verify(tx, email);
  assert.equal((await step(tx, { step: 'COMPLETE' })).operationReady, true);
  const replacement = randomBytes(20).toString('base64url');
  secrets.push(replacement);
  await api('/password/reset', {
    resetHandle: tx.handle,
    newPassword: replacement,
  });
  assert.notEqual((await api('/session')).state, 'AUTHENTICATED');
  tx = await create('LOGIN', 'EMAIL_PASSWORD');
  await step(tx, { step: 'PASSWORD_LOGIN', email, password }, 401);
  await step(tx, { step: 'PASSWORD_LOGIN', email, password: replacement });
  await step(tx, { step: 'COMPLETE' });
  // CLUB-04: same central user, profile versions, scoped reauthentication, bindings and password revocation.
  let methods = await api('/login-methods');
  const me = await api('/session');
  const profileRequest = b.request('/profile', {
    method: 'PATCH',
    body: { displayName: 'Club 管理验证', expectedVersion: me.user.version },
    headers: { 'Idempotency-Key': crypto.randomUUID() },
  });
  const profileReply = await raw(profileRequest);
  assert.equal(profileReply.status, 200, await profileReply.clone().text());
  assert.equal((await api('/session')).user.displayName, 'Club 管理验证');
  const reauth = async (
    operation,
    target,
    method = 'EMAIL_PASSWORD',
    credential = replacement,
  ) => {
    const t = await api('/reauthentications', { method, operation, target });
    if (method === 'EMAIL_PASSWORD')
      await step(t, { step: 'PASSWORD_LOGIN', email, password: credential });
    else if (method === 'PHONE_OTP') {
      await db
        .prepare('UPDATE auth_rate_bucket SET expires_at=0 WHERE bucket_hash=?')
        .bind(
          createHash('sha256')
            .update('v2-delivery-resend:SMS:+8613800000644')
            .digest('hex'),
        )
        .run();
      await verify(t, '+8613800000644');
    } else {
      const p = await provider(method, 'SUCCESS', undefined, t);
      await api('/auth/callback' + p.query);
      return t;
    }
    assert.equal((await step(t, { step: 'COMPLETE' })).operationReady, true);
    return t;
  };
  const commit = async (path, body, status = 200, key = crypto.randomUUID()) =>
    api(path, body, status, { 'Idempotency-Key': key });
  methods = await api('/login-methods');
  let r = await reauth('UNLINK_METHOD', {
    bindingId: methods.loginMethods[0].bindingId,
  });
  await commit(
    '/login-methods/' + methods.loginMethods[0].bindingId + '/unlink',
    { reauthHandle: r.handle, expectedVersion: methods.version },
    409,
  );
  // CLUB-04: cancel either proof after both BFF claims but before sending the mutation.
  // Both leases must still be current; no request may reach Auth and no receipt may survive.
  for (const [cancelReauth, target] of [
    [true, '+8613800000647'],
    [false, '+8613800000648'],
  ]) {
    const re = await reauth('BIND_METHOD', { method: 'PHONE' });
    const next = await api('/auth/transactions', {
      purpose: 'BIND',
      method: 'PHONE_OTP',
      reauthHandle: re.handle,
    });
    await verify(next, target);
    await step(next, { step: 'COMPLETE' });
    const calls = bindCalls;
    beforeBind = () =>
      api(
        '/auth/transactions/' +
          (cancelReauth ? re.handle : next.handle) +
          '/cancel',
        {},
      );
    await commit(
      '/login-methods/bind',
      {
        reauthHandle: re.handle,
        identityHandle: next.handle,
        expectedVersion: methods.version,
      },
      409,
    );
    assert.equal(
      bindCalls,
      calls,
      'Cancelled proof must block the upstream mutation',
    );
    assert.equal((await api('/login-methods')).version, methods.version);
    for (const handle of [re.handle, next.handle]) {
      const row = await db
        .prepare('SELECT box FROM central_account_transactions WHERE id=?')
        .bind(handle)
        .first();
      assert.equal(
        row.box,
        null,
        'Cancelled or expired proof must not retain a receipt',
      );
    }
  }
  r = await reauth('BIND_METHOD', { method: 'PHONE' });
  await api('/auth/transactions/' + r.handle, undefined, 401, {}, attacker);
  await api(
    '/auth/transactions',
    { purpose: 'BIND', method: 'GOOGLE', reauthHandle: r.handle },
    403,
  );
  let identity = await api('/auth/transactions', {
    purpose: 'BIND',
    method: 'PHONE_OTP',
    reauthHandle: r.handle,
  });
  await verify(identity, '+8613800000644');
  await step(identity, { step: 'COMPLETE' });
  const bindBody = {
      reauthHandle: r.handle,
      identityHandle: identity.handle,
      expectedVersion: methods.version,
    },
    bindKey = crypto.randomUUID();
  methods = await commit('/login-methods/bind', bindBody, 200, bindKey);
  assert.deepEqual(
    await commit('/login-methods/bind', bindBody, 200, bindKey),
    methods,
  );
  assert.equal(
    methods.loginMethods.filter((m) => m.type === 'PHONE').length,
    1,
  );
  await commit(
    '/login-methods/bind',
    { ...bindBody, expectedVersion: methods.version },
    409,
    bindKey,
  );
  for (const method of ['GOOGLE', 'GITHUB']) {
    r = await reauth('BIND_METHOD', { method }, 'PHONE_OTP');
    identity = await api('/auth/transactions', {
      purpose: 'BIND',
      method,
      reauthHandle: r.handle,
    });
    const p = await provider(method, 'SUCCESS', undefined, identity);
    const completed = await api('/auth/callback' + p.query);
    assert.equal(completed.verificationHandle, identity.handle);
    await api('/auth/callback' + p.query, undefined, 403);
    methods = await commit('/login-methods/bind', {
      reauthHandle: r.handle,
      identityHandle: identity.handle,
      expectedVersion: methods.version,
    });
  }
  // Verify through both external methods; cancelling a sensitive transaction never logs out the user.
  for (const method of ['GOOGLE', 'GITHUB']) {
    r = await reauth('CHANGE_PASSWORD', { kind: 'PASSWORD' }, method);
    await api('/auth/transactions/' + r.handle + '/cancel', {});
    assert.equal((await api('/session')).state, 'AUTHENTICATED');
  }
  // A replacement uses a new verified identity and preserves the old binding on uniqueness conflict.
  const phone = methods.loginMethods.find((m) => m.type === 'PHONE');
  r = await reauth(
    'REPLACE_METHOD',
    { bindingId: phone.bindingId },
    'PHONE_OTP',
  );
  identity = await api('/auth/transactions', {
    purpose: 'REPLACE',
    method: 'PHONE_OTP',
    reauthHandle: r.handle,
    bindingId: phone.bindingId,
  });
  await verify(identity, '+8613800000604');
  await step(identity, { step: 'COMPLETE' });
  await commit(
    '/login-methods/' + phone.bindingId + '/replace',
    {
      reauthHandle: r.handle,
      identityHandle: identity.handle,
      expectedVersion: methods.version,
    },
    409,
  );
  const unchanged = await api('/login-methods');
  assert.equal(unchanged.version, methods.version);
  assert.deepEqual(
    unchanged.loginMethods.toSorted((a, b) =>
      a.bindingId.localeCompare(b.bindingId),
    ),
    methods.loginMethods.toSorted((a, b) =>
      a.bindingId.localeCompare(b.bindingId),
    ),
  );
  r = await reauth('REPLACE_METHOD', { bindingId: phone.bindingId }, 'GOOGLE');
  identity = await api('/auth/transactions', {
    purpose: 'REPLACE',
    method: 'PHONE_OTP',
    reauthHandle: r.handle,
    bindingId: phone.bindingId,
  });
  await verify(identity, '+8613800000645');
  await step(identity, { step: 'COMPLETE' });
  methods = await commit('/login-methods/' + phone.bindingId + '/replace', {
    reauthHandle: r.handle,
    identityHandle: identity.handle,
    expectedVersion: methods.version,
  });
  const github = methods.loginMethods.find((m) => m.type === 'GITHUB');
  r = await reauth('UNLINK_METHOD', { bindingId: github.bindingId }, 'GOOGLE');
  methods = await commit('/login-methods/' + github.bindingId + '/unlink', {
    reauthHandle: r.handle,
    expectedVersion: methods.version,
  });
  assert.ok(!methods.loginMethods.some((m) => m.type === 'GITHUB'));
  // A separate browser holds an independent login which must be revoked by password change.
  const other = browser();
  await api('/session', undefined, 200, {}, other);
  const otherTx = await api(
    '/auth/transactions',
    { purpose: 'LOGIN', method: 'EMAIL_PASSWORD' },
    200,
    {},
    other,
  );
  await api(
    '/auth/transactions/' + otherTx.handle + '/submit',
    { step: 'PASSWORD_LOGIN', email, password: replacement },
    200,
    {},
    other,
  );
  await api(
    '/auth/transactions/' + otherTx.handle + '/submit',
    { step: 'COMPLETE' },
    200,
    {},
    other,
  );
  const currentSession = (await api('/session')).session;
  r = await reauth('CHANGE_PASSWORD', { kind: 'PASSWORD' }, 'GOOGLE');
  const finalPassword = randomBytes(20).toString('base64url');
  secrets.push(finalPassword);
  await commit('/password/change', {
    reauthHandle: r.handle,
    newPassword: finalPassword,
    expectedVersion: methods.version,
  });
  assert.equal(
    (await api('/session')).session.loginSessionId,
    currentSession.loginSessionId,
  );
  assert.equal(
    (await api('/session')).session.absoluteExpiresAt,
    currentSession.absoluteExpiresAt,
  );
  assert.notEqual(
    (await api('/session', undefined, 200, {}, other)).state,
    'AUTHENTICATED',
  );
  process.stdout.write(
    'PASS CLUB-04 real Auth: profile, four reauthentication methods, bind/replace/unlink, last-method protection, conflict preservation, receipts, password session revocation\n',
  );
  await end();
  for (const method of ['GOOGLE', 'GITHUB']) {
    const p = await provider(method);
    const bad = new URLSearchParams(p.query);
    bad.set('state', randomBytes(32).toString('base64url'));
    await api('/auth/callback?' + bad, undefined, 403);
    await api('/auth/callback' + p.query, undefined, 409, {}, attacker);
    const signed = await api('/auth/callback' + p.query);
    assert.equal(signed.account.state, 'AUTHENTICATED');
    await api('/auth/callback' + p.query, undefined, 409);
    await end();
  }
  const cancelled = await provider('GOOGLE', 'CANCEL');
  assert.equal(
    (await api('/auth/callback' + cancelled.query)).status,
    'CANCELLED',
  );
  tx = await create('LOGIN', 'EMAIL_PASSWORD');
  await api('/auth/transactions/' + tx.handle + '/cancel', {});
  await step(tx, { step: 'PASSWORD_LOGIN', email, password: replacement }, 409);
  const rows = await db
    .prepare(
      'SELECT box FROM central_account_transactions WHERE box IS NOT NULL',
    )
    .all();
  for (const row of rows.results)
    for (const s of secrets) assert.ok(!row.box.includes(s));
  process.stdout.write(
    'PASS CLUB-03 real Auth: email/signup/reset, SMS, Google/GitHub complete/cancel, CSRF, wrong browser/state, replay refusal and encrypted restart\n',
  );
} finally {
  await proxy.dispose();
}
