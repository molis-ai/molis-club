// CLUB-LIVE-01: real Auth WASM/D1 and Club BFF; only external providers are intercepted.
// No real credentials, messages, persistent database or provider accounts are used.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  randomBytes,
  generateKeyPairSync,
  sign,
  createHash,
} from 'node:crypto';
import { createManagementHandoffHandler } from '../lib/account/management-handoff.ts';
import { createCentralAccountClient } from '../lib/account/client.ts';
import { createClubSessionManager } from '../lib/account/sessions.ts';
import { createAuthenticationHandler } from '../lib/account/auth-http.ts';
import { createAccountBff } from '../lib/account/bff.ts';
import { configuration, browser } from '../tests/fixtures/account-sessions.mjs';
const source = process.env.MOLIS_AUTH_SOURCE;
assert.ok(source && isAbsolute(source));
const { getRustProxy, initializeLocalRuntime } = await import(
  pathToFileURL(resolve(source, 'worker/scripts/local-runtime.mjs')).href
);
const secret = () => randomBytes(32).toString('base64url');
const cfg = structuredClone(configuration());
cfg.client = { ...cfg.client, deliveryMode: 'LIVE', providerMode: 'LIVE' };
const authOrigin = cfg.client.authOrigin,
  key = secret(),
  password = secret();
const target = '+8613800000000',
  email = 'club-live@example.test';
const pair = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = {
  ...pair.publicKey.export({ format: 'jwk' }),
  kid: 'club-live',
  alg: 'RS256',
  use: 'sig',
};
let mailCode = '',
  googleClaims,
  failMail = false;
const calls = new Set();
const proxy = await getRustProxy(
  {
    AUTH_ORIGIN: authOrigin,
    AUTH_WEB_SESSION_KEY: secret(),
    AUTH_WEB_CLIENT_ID: 'handoff-web',
    PROVIDER_STATE_KEY: secret(),
    ALIYUN_ACCESS_KEY_ID: 'synthetic-key',
    ALIYUN_ACCESS_KEY_SECRET: secret(),
    ALIYUN_SMS_SIGN_NAME: 'Synthetic signature',
    ALIYUN_SMS_TEST_ALLOWLIST: target,
    ALIYUN_MAIL_REGION: 'cn-hangzhou',
    ALIYUN_MAIL_ACCOUNT_NAME: 'no-reply@notify.example.test',
    UNIFIED_GOOGLE_CLIENT_ID: 'club-test.apps.googleusercontent.com',
    UNIFIED_GOOGLE_CLIENT_SECRET: secret(),
    UNIFIED_GITHUB_CLIENT_ID: 'club-test',
    UNIFIED_GITHUB_CLIENT_SECRET: secret(),
    UNIFIED_ACCOUNT_CONFIG: JSON.stringify({
      environmentId: 'unified-local',
      kind: 'LOCAL',
      authOrigin,
      deliveryMode: 'LIVE',
      providerMode: 'LIVE',
    }),
  },
  async (request) => {
    const url = new URL(request.url);
    calls.add(url.hostname);
    if (url.hostname === 'dypnsapi.aliyuncs.com') {
      const form = new URLSearchParams(await request.text());
      assert.equal(form.get('PhoneNumber'), target.slice(3));
      if (form.get('Action') === 'SendSmsVerifyCode')
        return Response.json({
          Code: 'OK',
          Success: true,
          Model: { BizId: 'synthetic' },
        });
      assert.equal(form.get('Action'), 'CheckSmsVerifyCode');
      return Response.json({
        Code: 'OK',
        Success: true,
        Model: {
          VerifyResult: form.get('VerifyCode') === '654321' ? 'PASS' : 'FAIL',
        },
      });
    }
    if (url.hostname === 'dm.aliyuncs.com') {
      if (failMail)
        return Response.json({ Code: 'ServiceUnavailable' }, { status: 503 });
      const form = new URLSearchParams(await request.text());
      assert.ok([email, 'existing-' + email, 'direct@example.test'].includes(form.get('ToAddress')));
      mailCode = form.get('TextBody').match(/\b\d{6}\b/)[0];
      return Response.json({ RequestId: 'synthetic', EnvId: 'synthetic' });
    }
    if (url.href === 'https://www.googleapis.com/oauth2/v3/certs')
      return Response.json({ keys: [jwk] });
    if (url.href === 'https://oauth2.googleapis.com/token') {
      const form = new URLSearchParams(await request.text());
      assert.equal(
        createHash('sha256')
          .update(form.get('code_verifier'))
          .digest('base64url'),
        googleClaims.challenge,
      );
      const now = Math.floor(Date.now() / 1000);
      const data = [
        Buffer.from(JSON.stringify({ alg: 'RS256', kid: jwk.kid })).toString(
          'base64url',
        ),
        Buffer.from(
          JSON.stringify({
            iss: 'https://accounts.google.com',
            aud: 'club-test.apps.googleusercontent.com',
            sub: 'club-google-subject',
            nonce: googleClaims.nonce,
            iat: now,
            exp: now + 300,
            name: 'Club Google',
            email: 'google@example.test',
            email_verified: true,
            picture: 'https://lh3.googleusercontent.com/synthetic',
          }),
        ).toString('base64url'),
      ].join('.');
      return Response.json({
        access_token: secret(),
        token_type: 'Bearer',
        id_token:
          data +
          '.' +
          sign('RSA-SHA256', Buffer.from(data), pair.privateKey).toString(
            'base64url',
          ),
      });
    }
    if (url.href === 'https://github.com/login/oauth/access_token') {
      return Response.json({ access_token: secret(), token_type: 'bearer' });
    }
    assert.equal(url.href, 'https://api.github.com/user');
    return Response.json({
      id: 1234567,
      login: 'club-github',
      name: 'Club GitHub',
      avatar_url: 'https://avatars.githubusercontent.com/u/1234567?v=4',
    });
  },
);
const db = proxy.env.DB;
let b = browser();
const client = createCentralAccountClient(cfg, (r) => proxy.fetch(r));
async function raw(request, redirect = false) {
  const owner = await createClubSessionManager({
    db,
    client,
    encryptionKey: key,
  });
  const path = new URL(request.url).pathname;
  return path.includes('/auth/') ||
    path === '/account/callback' ||
    path.endsWith('/password/reset') ||
    path.endsWith('/password/change') ||
    path.endsWith('/reauthentications')
    ? createAuthenticationHandler(db, client, owner, key)(request, redirect)
    : owner.decorate(
        request,
        await createAccountBff(client, owner.sessions)(request),
      );
}
async function api(path, body, status = 200, headers = {}) {
  const r = b.apply(
    await raw(
      b.request(path, {
        method: body === undefined ? 'GET' : 'POST',
        body,
        headers,
      }),
    ),
  );
  const text = await r.text();
  assert.equal(r.status, status, text);
  const value = JSON.parse(text);
  if (status !== 200) return value.error;
  assert.ok(!text.includes(password));
  assert.ok(
    !/"(?:accessToken|refreshToken|verificationProof|operationProof)"/.test(
      text,
    ),
  );
  return value.data;
}
const create = (purpose, method) =>
  api('/auth/transactions', { purpose, method });
const step = (tx, body, status) =>
  api('/auth/transactions/' + tx.handle + '/submit', body, status);
const logout = () =>
  api('/logout', { scope: 'CURRENT_LOGIN' }, 200, {
    'Idempotency-Key': crypto.randomUUID(),
  });
async function verify(tx, address, code) {
  const sent = await step(tx, { step: 'REQUEST_CHALLENGE', address });
  const wrong = await step(
    tx,
    {
      step: 'VERIFY_CHALLENGE',
      challengeHandle: sent.challengeHandle,
      credential: '000000',
    },
    401,
  );
  assert.equal(wrong.code, 'INVALID_CREDENTIALS');
  await step(tx, {
    step: 'VERIFY_CHALLENGE',
    challengeHandle: sent.challengeHandle,
    credential: code ? code : mailCode,
  });
}
async function provider(method, cancel = false) {
  const tx = await create('LOGIN', method);
  const started = await step(tx, { step: 'START_PROVIDER' });
  const entry = await proxy.fetch(new Request(started.browserStartUrl));
  assert.equal(entry.status, 303);
  const authorize = new URL(entry.headers.get('location'));
  assert.equal(authorize.searchParams.get('prompt'), 'select_account');
  googleClaims = {
    nonce: authorize.searchParams.get('nonce'),
    challenge: authorize.searchParams.get('code_challenge'),
  };
  const query = new URLSearchParams({
    state: authorize.searchParams.get('state'),
    ...(cancel ? { error: 'access_denied' } : { code: secret() }),
  });
  const result = await proxy.fetch(
    new Request(
      authOrigin +
        '/api/v2/auth/external/' +
        method.toLowerCase() +
        '/callback?' +
        query,
      { headers: { Cookie: entry.headers.get('set-cookie').split(';')[0] } },
    ),
  );
  assert.equal(result.status, 303, await result.clone().text());
  const location = new URL(result.headers.get('location'));
  assert.equal(location.origin, cfg.client.productOrigin);
  const request = b.request('/auth/callback' + location.search);
  const response = b.apply(await raw(request, true));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('location'), null);
  assert.match(await response.text(), /授权流程已结束/);
  const status = await api('/auth/transactions/' + tx.handle);
  assert.equal(status.status, cancel ? 'CANCELLED' : 'CONSUMED');
  assert.equal(status.nextStep, 'NONE');
  const replay = b.apply(
    await raw(b.request('/auth/callback' + location.search), true),
  );
  assert.ok(replay.status >= 400);
  assert.equal(replay.headers.get('location'), null);
  return api('/session');
}
try {
  await initializeLocalRuntime(proxy);
  for (const file of [
    resolve(source, 'worker/unified-account-local-seed.sql'),
    'drizzle/0004_central_account_sessions.sql',
    'drizzle/0005_central_account_transactions.sql',
  ])
    for (const sql of readFileSync(file, 'utf8')
      .replace(/--[^\n]*/g, '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean))
      await db.prepare(sql).run();
  await db
    .prepare(
      "UPDATE auth_environment SET delivery_mode='LIVE',provider_mode='LIVE',version=version+1 WHERE id='unified-local'",
    )
    .run();
  await db
    .prepare(
      `INSERT INTO auth_client(id,client_id,application_id,client_type,scopes,redirects) VALUES ('handoff-web','handoff-web',?,'WEB','["account","profile"]',?)`,
    )
    .bind(cfg.applicationId, JSON.stringify([authOrigin + '/account/callback']))
    .run();
  await db
    .prepare(
      `INSERT INTO auth_client_policy(client_id,policy_profile,environment_id,allowed_origins,created_at,updated_at) VALUES ('handoff-web','unified-account-v2','unified-local',?,0,0)`,
    )
    .bind(JSON.stringify([authOrigin]))
    .run();
  await api('/session');
  let tx = await create('EMAIL_SIGNUP', 'EMAIL_CODE');
  await verify(tx, email);
  assert.equal((await api('/auth/transactions/' + tx.handle)).nextStep, 'EMAIL_SIGNUP');
  assert.equal((await db.prepare('SELECT count(*) AS n FROM auth_user_email WHERE canonical_email=?').bind(email).first()).n, 0);
  await step(tx, { step: 'EMAIL_SIGNUP', email, password });
  const signup = await step(tx, { step: 'COMPLETE' });
  assert.equal(signup.account.user.email, email);
  const priorAccountHandoff = await handoffStart();
  await logout();
  const duplicateEmail = 'existing-' + email;
  await db.prepare('INSERT INTO auth_user_email VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), signup.account.user.userId, duplicateEmail, Date.now(), Date.now()).run();
  const duplicate = await create('EMAIL_SIGNUP', 'EMAIL_CODE');
  const duplicateChallenge = await step(duplicate, { step: 'REQUEST_CHALLENGE', address: duplicateEmail });
  const conflict = await step(duplicate, {
    step: 'VERIFY_CHALLENGE', challengeHandle: duplicateChallenge.challengeHandle,
    credential: mailCode,
  }, 409);
  assert.equal(conflict.code, 'IDENTITY_IN_USE');
  tx = await create('LOGIN', 'EMAIL_PASSWORD');
  await step(tx, { step: 'PASSWORD_LOGIN', email, password });
  assert.equal(
    (await step(tx, { step: 'COMPLETE' })).account.user.userId,
    signup.account.user.userId,
  );
  await logout();
  await db.prepare('DELETE FROM auth_rate_bucket').run();
  // CLUB-LOGIN-04: existing email codes log in without another password setup.
  tx = await create('LOGIN', 'EMAIL_CODE');
  await verify(tx, email);
  assert.equal((await api('/auth/transactions/' + tx.handle)).nextStep, 'CODE_LOGIN');
  await step(tx, { step: 'CODE_LOGIN' });
  assert.equal((await step(tx, { step: 'COMPLETE' })).account.user.userId, signup.account.user.userId);
  await logout();
  tx = await create('LOGIN', 'ACCOUNT_PASSWORD');
  await step(tx, { step: 'PASSWORD_LOGIN', identifier: email, password });
  assert.equal(
    (await step(tx, { step: 'COMPLETE' })).account.user.userId,
    signup.account.user.userId,
  );
  await logout();
  const boundPhone = '+8613900000000';
  await db
    .prepare('INSERT INTO auth_user_phone VALUES (?,?,?,?,?)')
    .bind(
      crypto.randomUUID(),
      signup.account.user.userId,
      boundPhone,
      Date.now(),
      Date.now(),
    )
    .run();
  tx = await create('LOGIN', 'ACCOUNT_PASSWORD');
  await step(
    tx,
    { step: 'PASSWORD_LOGIN', identifier: boundPhone, password: 'wrong' },
    401,
  );
  await step(tx, { step: 'PASSWORD_LOGIN', identifier: boundPhone, password });
  assert.equal(
    (await step(tx, { step: 'COMPLETE' })).account.user.userId,
    signup.account.user.userId,
  );
  await logout();
  await db
    .prepare('DELETE FROM auth_user_phone WHERE canonical_phone=?')
    .bind(boundPhone)
    .run();
  tx = await create('LOGIN', 'ACCOUNT_PASSWORD');
  await step(
    tx,
    { step: 'PASSWORD_LOGIN', identifier: boundPhone, password },
    401,
  );
  await api('/auth/transactions/' + tx.handle + '/cancel', {});
  // Start this first-registration scenario in a fresh browser, keeping the strict ANONYMOUS assertion.
  b = browser();
  await api('/session');
  const sentPhone = await api('/auth/verification-codes',{purpose:'LOGIN',channel:'SMS',address:target});
  assert.ok(sentPhone.verificationId);
  assert.equal((await db.prepare('SELECT count(*) AS n FROM auth_user_phone WHERE canonical_phone=?').bind(target).first()).n,0);
  await api('/auth/login/code',{verificationId:sentPhone.verificationId,code:'000000'},401);
  assert.equal((await api('/session')).state,'ANONYMOUS');
  assert.equal((await api('/auth/login/code',{verificationId:sentPhone.verificationId,code:'654321'})).account.state,'AUTHENTICATED');
  assert.equal((await api('/me')).passwordEnabled,false);
  // CLUB-SSO-01: real product BFF -> Auth browser -> product callback -> Auth management.
  async function handoffStart() {
    const owner = await createClubSessionManager({
      db,
      client,
      encryptionKey: key,
    });
    const handler = createManagementHandoffHandler(client, owner);
    const start = await handler(b.request('/management'));
    assert.equal(start.status, 303, await start.clone().text());
    const proof = start.headers.get('set-cookie').split(';')[0];
    const authStart = await proxy.fetch(
      new Request(start.headers.get('location')),
    );
    assert.equal(authStart.status, 303, await authStart.clone().text());
    const authCookie = authStart.headers.get('set-cookie').split(';')[0];
    const callback = new Request(authStart.headers.get('location'), {
      headers: { Cookie: b.cookie + '; ' + proof },
    });
    return { handler, callback, authCookie, start, proof };
  }
  const switched = await priorAccountHandoff.handler(
    new Request(priorAccountHandoff.callback.url, {
      headers: { Cookie: b.cookie + '; ' + priorAccountHandoff.proof },
    }),
  );
  assert.equal(switched.status, 400);
  const first = await handoffStart();
  assert.equal(
    (
      await first.handler(
        new Request(first.callback.url, { headers: { Cookie: b.cookie } }),
      )
    ).status,
    400,
  );
  const approval = await first.handler(first.callback);
  assert.equal(approval.status, 303, await approval.clone().text());
  const finishUrl = approval.headers.get('location');
  assert.ok(
    !finishUrl.includes('accessToken') && !finishUrl.includes('refreshToken'),
  );
  assert.equal((await proxy.fetch(new Request(finishUrl))).status, 400);
  const finish = await proxy.fetch(
    new Request(finishUrl, { headers: { Cookie: first.authCookie } }),
  );
  assert.equal(finish.status, 303, await finish.clone().text());
  assert.equal(finish.headers.get('location'), authOrigin + '/');
  const authCookie = finish.headers
    .get('set-cookie')
    .match(/molis-auth-web=[^; ,]+/)[0];
  const management = await proxy.fetch(
    new Request(authOrigin + '/api/account/session', {
      headers: { Cookie: authCookie },
    }),
  );
  const managementData = (await management.json()).data;
  assert.equal(managementData.state, 'AUTHENTICATED');
  assert.equal(managementData.user.userId, (await api('/me')).user.userId);
  const sourceSession = (await api('/me')).session;
  const adopted = await db
    .prepare('SELECT * FROM auth_login_session WHERE id=?')
    .bind(managementData.session.loginSessionId)
    .first();
  const original = await db
    .prepare('SELECT * FROM auth_login_session WHERE id=?')
    .bind(sourceSession.loginSessionId)
    .first();
  assert.equal(adopted.identity_verified_at, original.identity_verified_at);
  assert.equal(adopted.authenticated_at, original.authenticated_at);
  assert.equal(adopted.absolute_expires_at, original.absolute_expires_at);
  assert.equal(
    (
      await proxy.fetch(
        new Request(finishUrl, { headers: { Cookie: first.authCookie } }),
      )
    ).status,
    400,
  );
  assert.equal((await first.handler(first.callback)).status, 400);
  const expired = await handoffStart();
  const expiredId = new URL(expired.callback.url).searchParams.get('handoff');
  await db
    .prepare('UPDATE auth_management_handoff SET expires_at=0 WHERE id=?')
    .bind(expiredId)
    .run();
  assert.equal((await expired.handler(expired.callback)).status, 400);
  assert.equal(
    (
      await expired.handler(
        b.request('/management', {
          headers: { 'Sec-Fetch-Site': 'cross-site' },
        }),
      )
    ).status,
    400,
  );
  const stale = await handoffStart();
  const approved = await stale.handler(stale.callback);
  await db
    .prepare(
      'UPDATE auth_login_session SET session_revision=session_revision+1 WHERE id=?',
    )
    .bind(sourceSession.loginSessionId)
    .run();
  assert.equal(
    (
      await proxy.fetch(
        new Request(approved.headers.get('location'), {
          headers: { Cookie: stale.authCookie },
        }),
      )
    ).status,
    400,
  );
  // Restore only this isolated fixture revision to continue the unrelated password tests.
  await db
    .prepare(
      'UPDATE auth_login_session SET session_revision=session_revision-1 WHERE id=?',
    )
    .bind(sourceSession.loginSessionId)
    .run();
  // Password is optional; a verified phone account starts without a password.
  assert.equal((await api('/me')).passwordEnabled, false);
  const phoneMethods = await api('/login-methods');
  const phoneMe = await api('/me');
  assert.deepEqual(phoneMethods, {
    loginMethods: phoneMe.loginMethods,
    version: phoneMe.user.version,
  });
  assert.equal(
    phoneMe.loginMethods.find((m) => m.type === 'PHONE').maskedLabel,
    '+86 138****0000',
  );
  assert.ok(!JSON.stringify(phoneMe).includes(target));
  const reauth = await api('/reauthentications', {
    method: 'PHONE_OTP',
    operation: 'CHANGE_PASSWORD',
    target: { kind: 'PASSWORD' },
    useSession: true,
  });
  assert.equal((await step(reauth, { step: 'COMPLETE' })).operationReady, true);
  await api(
    '/password/change',
    {
      reauthHandle: reauth.handle,
      expectedVersion: phoneMethods.version,
      newPassword: password,
    },
    200,
    { 'Idempotency-Key': crypto.randomUUID() },
  );
  assert.equal((await api('/me')).passwordEnabled, true);
  await logout();
  assert.equal((await api('/auth/login/password',{identifier:target,password})).account.state,'AUTHENTICATED');
  assert.equal((await api('/me')).passwordEnabled, true);
  await logout();
  await db.prepare('DELETE FROM auth_rate_bucket').run();
  // Existing phone accounts go straight through code login, with no password step.
  tx = await create('LOGIN', 'PHONE_OTP');
  await verify(tx, target, '654321');
  assert.equal((await api('/auth/transactions/' + tx.handle)).nextStep, 'CODE_LOGIN');
  await step(tx, { step: 'CODE_LOGIN' });
  await step(tx, { step: 'COMPLETE' });
  assert.equal((await api('/me')).passwordEnabled, true);
  await logout();
  tx = await create('PASSWORD_RESET', 'EMAIL_CODE');
  await verify(tx, email);
  assert.equal((await step(tx, { step: 'COMPLETE' })).operationReady, true);
  const nextPassword = secret();
  await api('/password/reset', {
    resetHandle: tx.handle,
    newPassword: nextPassword,
  });
  tx = await create('LOGIN', 'EMAIL_PASSWORD');
  await step(tx, { step: 'PASSWORD_LOGIN', email, password }, 401);
  await step(tx, { step: 'PASSWORD_LOGIN', email, password: nextPassword });
  await step(tx, { step: 'COMPLETE' });
  await logout();
  for (const method of ['GOOGLE', 'GITHUB']) {
    const first = await provider(method);
    assert.equal(first.state, 'AUTHENTICATED');
    assert.equal(
      first.user.displayName,
      method === 'GOOGLE' ? 'Club Google' : 'Club GitHub',
    );
    assert.match(first.user.avatarUrl, /^https:\/\//);
    assert.equal(
      first.user.email,
      method === 'GOOGLE' ? 'google@example.test' : null,
    );
    await logout();
    assert.equal((await provider(method)).user.userId, first.user.userId);
    await logout();
    assert.equal((await api('/session')).state, 'EXPIRED');
    assert.equal((await provider(method, true)).state, 'EXPIRED');
    b = browser();
    assert.equal((await api('/session')).state, 'ANONYMOUS');
    assert.equal((await provider(method, true)).state, 'ANONYMOUS');
  }
  await logout();
  b = browser(); await api('/session');
  await db.prepare('DELETE FROM auth_rate_bucket').run();
  // CLUB-LOGIN-05 / CLUB-LOGIN-06: optional password and verification ownership.
  const freshEmail='direct@example.test';
  const sent=await api('/auth/verification-codes',{purpose:'LOGIN',channel:'EMAIL',address:freshEmail});
  const originalCode=mailCode;
  assert.equal((await db.prepare('SELECT count(*) n FROM auth_user_email WHERE canonical_email=?').bind(freshEmail).first()).n,0);
  const firstBrowser=b;
  b=browser(); await api('/session');
  await api('/auth/login/code',{verificationId:sent.verificationId,code:originalCode},409);
  b=firstBrowser;
  await api('/auth/login/code',{verificationId:sent.verificationId,code:originalCode==='000000'?'111111':'000000'},401);
  const direct=await api('/auth/login/code',{verificationId:sent.verificationId,code:originalCode});
  assert.equal(direct.account.state,'AUTHENTICATED');
  assert.equal((await api('/me')).passwordEnabled,false);
  await api('/auth/login/code',{verificationId:sent.verificationId,code:originalCode},409);
  await logout();
  await api('/auth/login/password',{identifier:freshEmail,password},401);
  await db.prepare('DELETE FROM auth_rate_bucket').run();
  const again=await api('/auth/verification-codes',{purpose:'LOGIN',channel:'EMAIL',address:freshEmail});
  assert.equal((await api('/auth/login/code',{verificationId:again.verificationId,code:mailCode})).account.user.userId,direct.account.user.userId);
  await logout();
  await db.prepare('DELETE FROM auth_rate_bucket').run();
  const old=await api('/auth/verification-codes',{purpose:'LOGIN',channel:'EMAIL',address:freshEmail});
  const oldCode=mailCode;
  await db.prepare('DELETE FROM auth_rate_bucket').run();
  const newer=await api('/auth/verification-codes',{purpose:'LOGIN',channel:'EMAIL',address:freshEmail});
  await api('/auth/login/code',{verificationId:old.verificationId,code:oldCode},409);
  const lastCode=mailCode;
  await db.prepare('UPDATE auth_verification_challenge SET created_at=1,expires_at=2 WHERE consumed_at IS NULL').run();
  await api('/auth/login/code',{verificationId:newer.verificationId,code:lastCode},401);
  await db.prepare('DELETE FROM auth_rate_bucket').run();
  failMail = true;
  await db.prepare('DELETE FROM auth_rate_bucket').run();
  tx = await create('EMAIL_SIGNUP', 'EMAIL_CODE');
  assert.equal(
    (await step(tx, { step: 'REQUEST_CHALLENGE', address: email }, 503)).code,
    'UPSTREAM_UNAVAILABLE',
  );
  assert.equal(
    (await db.prepare('SELECT count(*) n FROM auth_mock_delivery').first()).n,
    0,
  );
  assert.deepEqual(
    [...calls].sort((a, b) => a.localeCompare(b)),
    [
      'api.github.com',
      'dm.aliyuncs.com',
      'dypnsapi.aliyuncs.com',
      'github.com',
      'oauth2.googleapis.com',
      'www.googleapis.com',
    ].sort((a, b) => a.localeCompare(b)),
  );
  console.log(
    'PASS CLUB-LIVE-01 / CLUB-SSO-01: browser-bound management handoff and rejection checks; email signup/password/reset, SMS wrong/correct code, Google/GitHub profile and repeat/cancel/replay, HTML redirect, LIVE failure without mock fallback',
  );
} finally {
  await proxy.dispose();
}
