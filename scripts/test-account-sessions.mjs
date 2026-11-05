// CLUB-02: real Auth WASM + ephemeral D1; all delivery/providers remain MOCK.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash, randomBytes } from 'node:crypto';
import { readClubAccountConfig } from '../lib/account/config.ts';
import { createCentralAccountClient } from '../lib/account/client.ts';
import { createClubSessionManager } from '../lib/account/sessions.ts';
import { browser } from '../tests/fixtures/account-sessions.mjs';
import snapshot from '../lib/account/contracts/snapshot.json' with { type: 'json' };

const source = process.env.MOLIS_AUTH_SOURCE;
assert.ok(
  source && isAbsolute(source),
  'MOLIS_AUTH_SOURCE must name an explicit local Auth checkout',
);
for (const [file, digest] of Object.entries(snapshot.files))
  assert.equal(
    createHash('sha256')
      .update(readFileSync(resolve(source, 'contracts/unified-account', file)))
      .digest('hex'),
    digest,
    'Auth contract drift: ' + file,
  );
const { getRustProxy, initializeLocalRuntime } = await import(
  pathToFileURL(resolve(source, 'worker/scripts/local-runtime.mjs')).href
);
const authOrigin = 'http://127.0.0.1:8787',
  productOrigin = 'http://127.0.0.1:3000';
const proxy = await getRustProxy({
  AUTH_ORIGIN: authOrigin,
  UNIFIED_ACCOUNT_CONFIG: JSON.stringify({
    environmentId: 'unified-local',
    kind: 'LOCAL',
    authOrigin,
    deliveryMode: 'MOCK',
    providerMode: 'MOCK',
  }),
});
const secret = () => randomBytes(32).toString('base64url');
const challenge = (value) =>
  createHash('sha256').update(value).digest('base64url');
try {
  await initializeLocalRuntime(proxy);
  const db = proxy.env.DB;
  for (const file of [
    resolve(source, 'worker/unified-account-local-seed.sql'),
    new URL('../drizzle/0004_central_account_sessions.sql', import.meta.url),
  ])
    for (const sql of readFileSync(file, 'utf8')
      .replace(/--[^\n]*/g, '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean))
      await db.prepare(sql).run();
  const configuration = (work = false) =>
    readClubAccountConfig(
      JSON.stringify({
        applicationId: work
          ? 'molis-work-unified-local-app'
          : 'molis-club-unified-local-app',
        redirectUri:
          (work ? 'http://127.0.0.1:4207' : productOrigin) +
          '/account/callback',
        client: {
          environmentId: 'unified-local',
          environmentKind: 'LOCAL',
          authOrigin,
          productOrigin: work ? 'http://127.0.0.1:4207' : productOrigin,
          clientId: work
            ? 'molis-work-unified-local'
            : 'molis-club-unified-local',
          policyProfile: 'unified-account-v2',
          redirectAllowlist: [
            (work ? 'http://127.0.0.1:4207' : productOrigin) +
              '/account/callback',
          ],
          deliveryMode: 'MOCK',
          providerMode: 'MOCK',
        },
      }),
    );
  let refreshCount = 0,
    activityCount = 0;
  const client = createCentralAccountClient(
    configuration(),
    async (request) => {
      const path = new URL(request.url).pathname;
      if (
        path.endsWith('/auth/token') &&
        (await request.clone().json()).grantType === 'refresh_token'
      )
        refreshCount++;
      if (path.endsWith('/activity')) activityCount++;
      return proxy.fetch(request);
    },
  );
  const workClient = createCentralAccountClient(
    configuration(true),
    (request) => proxy.fetch(request),
  );
  const key = secret(),
    make = () => createClubSessionManager({ db, client, encryptionKey: key });
  const owner = await make(),
    second = await make();
  async function phoneLogin(c) {
    const phone = '+8613800000521',
      proof = secret(),
      verifier = secret(),
      cfg = c.config;
    // Age only this synthetic recipient's resend timer, avoiding a minute of wall-clock delay.
    // Quota counters and all production verification/session paths remain active.
    await db
      .prepare('UPDATE auth_rate_bucket SET expires_at=0 WHERE bucket_hash=?')
      .bind(
        createHash('sha256')
          .update('v2-delivery-resend:SMS:' + phone)
          .digest('hex'),
      )
      .run();
    const tx = (
      await c.call('createTransaction', {
        body: {
          clientId: cfg.client.clientId,
          redirectUri: cfg.redirectUri,
          state: secret(),
          purpose: 'LOGIN',
          method: 'PHONE_OTP',
          codeChallenge: challenge(verifier),
          codeChallengeMethod: 'S256',
          initiatorChallenge: challenge(proof),
        },
      })
    ).data;
    const path = { transactionId: tx.transactionId };
    const sent = (
      await c.call('createChallenge', {
        path,
        body: { channel: 'SMS', address: phone },
        initiatorProof: proof,
      })
    ).data;
    const delivered = await db
      .prepare(
        'SELECT m.credential FROM auth_mock_delivery m JOIN auth_verification_challenge c ON c.delivery_id=m.delivery_id WHERE c.id=?',
      )
      .bind(sent.challengeId)
      .first();
    const verified = (
      await c.call('verifyChallenge', {
        path: { ...path, challengeId: sent.challengeId },
        body: { credential: delivered.credential },
        initiatorProof: proof,
      })
    ).data;
    await c.call('signInPhone', {
      path,
      body: { verificationProof: verified.verificationProof },
      initiatorProof: proof,
    });
    const completed = (
      await c.call('completeTransaction', {
        path,
        body: {},
        initiatorProof: proof,
      })
    ).data;
    return (
      await c.call('exchangeToken', {
        body: {
          grantType: 'authorization_code',
          clientId: cfg.client.clientId,
          code: completed.code,
          redirectUri: cfg.redirectUri,
          codeVerifier: verifier,
        },
      })
    ).data;
  }
  const view = async (b, o = owner) =>
    (await (await b.call(o, client, '/session')).json()).data;
  async function signIn(b) {
    await b.call(owner, client, '/session');
    const request = b.request('/auth/transactions', { method: 'POST' }),
      permit = await owner.beginLogin(request),
      tokens = await phoneLogin(client);
    const result = await owner.completeLogin(request, permit, tokens);
    b.apply(owner.decorate(request, Response.json(result)));
    return tokens;
  }
  const a = browser(),
    b = browser(),
    aTokens = await signIn(a),
    bTokens = await signIn(b),
    workTokens = await phoneLogin(workClient);
  const workIdentity = await workClient.identifyToken(workTokens.accessToken);
  assert.equal((await view(a)).user.userId, workIdentity.user.userId);
  assert.notEqual(
    aTokens.session.loginSessionId,
    bTokens.session.loginSessionId,
  );
  assert.equal(
    (await view(a, await make())).session.loginSessionId,
    aTokens.session.loginSessionId,
    'fresh manager recovers persistent login',
  );
  const before = (await view(a)).session;
  // The central access token is expired without changing the BFF's future expiry metadata.
  // Two instances must recover a genuine central 401 through one durable refresh claim.
  await db
    .prepare(
      'UPDATE auth_login_access_token SET expires_at=0 WHERE login_session_id=?',
    )
    .bind(aTokens.session.loginSessionId)
    .run();
  const readings = await Promise.all([view(a, owner), view(a, second)]);
  for (const result of readings) {
    assert.equal(result.state, 'AUTHENTICATED');
    assert.equal(result.session.loginSessionId, aTokens.session.loginSessionId);
    assert.equal(result.session.authenticatedAt, before.authenticatedAt);
    assert.equal(result.session.lastActiveAt, before.lastActiveAt);
    assert.equal(result.session.absoluteExpiresAt, before.absoluteExpiresAt);
  }
  assert.equal(
    refreshCount,
    1,
    'only one refresh across two manager instances',
  );
  assert.equal(
    activityCount,
    0,
    'reads/restart/refresh do not keep login active',
  );
  assert.equal(
    (await view(a, await make())).session.loginSessionId,
    aTokens.session.loginSessionId,
  );
  const activity = await a.call(second, client, '/activity', {
    method: 'POST',
    body: { eventId: crypto.randomUUID(), kind: 'INTERACT' },
  });
  assert.equal(activity.status, 200);
  assert.equal(activity.headers.get('set-cookie'), null);
  assert.equal(activityCount, 1);
  const allRows = (
    await db.prepare('SELECT * FROM central_account_sessions').all()
  ).results;
  const dump = JSON.stringify(allRows);
  for (const value of [
    aTokens.accessToken,
    aTokens.refreshToken,
    bTokens.accessToken,
    bTokens.refreshToken,
    key,
    a.cookie.split('=')[1],
  ])
    assert.ok(
      !dump.includes(value),
      'D1 holds ciphertext/digests, not browser or central credentials',
    );
  const logout = async (browser, scope, requestKey = secret()) =>
    browser.call(second, client, '/logout', {
      method: 'POST',
      headers: { 'Idempotency-Key': requestKey },
      body: { scope },
    });
  assert.deepEqual((await (await logout(a, 'CURRENT_LOGIN')).json()).data, {
    localCleared: true,
    remoteRevocation: 'CONFIRMED',
  });
  assert.equal((await view(a, await make())).state, 'EXPIRED');
  assert.equal((await view(b, await make())).state, 'AUTHENTICATED');
  assert.equal(
    (await workClient.identifyToken(workTokens.accessToken)).user.userId,
    workIdentity.user.userId,
    'current Club logout preserves Work login',
  );
  const logoutKey = secret();
  assert.deepEqual(
    (await (await logout(b, 'ALL_MOLIS_PRODUCTS', logoutKey)).json()).data,
    { localCleared: true, remoteRevocation: 'CONFIRMED' },
  );
  assert.equal((await view(b, await make())).state, 'EXPIRED');
  await assert.rejects(workClient.identifyToken(workTokens.accessToken));
  await assert.rejects(
    workClient.call('exchangeToken', {
      body: {
        grantType: 'refresh_token',
        clientId: workClient.config.client.clientId,
        refreshToken: workTokens.refreshToken,
      },
    }),
  );
  assert.equal(
    (await (await logout(b, 'ALL_MOLIS_PRODUCTS', logoutKey)).json()).data
      .remoteRevocation,
    'CONFIRMED',
    'persisted logout receipt survives retries',
  );
  console.log(
    'PASS CLUB-02 real Auth MOCK: encrypted D1, isolated browser sessions, two-instance CAS refresh after central 401, restart, activity, current logout and all-products revocation',
  );
} finally {
  await proxy.dispose();
}
