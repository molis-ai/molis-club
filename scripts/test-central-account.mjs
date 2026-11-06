// Explicit integration against an isolated Auth WASM/D1 runtime; never a live URL.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash, randomBytes } from 'node:crypto';
import { readClubAccountConfig } from '../lib/account/config.ts';
import { createCentralAccountClient } from '../lib/account/client.ts';
import { createAccountBff } from '../lib/account/bff.ts';
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
    `Auth snapshot mismatch: ${file}`,
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
try {
  await initializeLocalRuntime(proxy);
  for (const sql of readFileSync(
    resolve(source, 'worker/unified-account-local-seed.sql'),
    'utf8',
  )
    .replace(/--[^\n]*/g, '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean))
    await proxy.env.DB.prepare(sql).run();
  const config = readClubAccountConfig(
    JSON.stringify({
      applicationId: 'molis-club-unified-local-app',
      redirectUri: productOrigin + '/account/callback',
      client: {
        environmentId: 'unified-local',
        environmentKind: 'LOCAL',
        authOrigin,
        productOrigin,
        clientId: 'molis-club-unified-local',
        policyProfile: 'unified-account-v2',
        redirectAllowlist: [productOrigin + '/account/callback'],
        deliveryMode: 'MOCK',
        providerMode: 'MOCK',
      },
    }),
  );
  const client = createCentralAccountClient(config, (request) =>
    proxy.fetch(request),
  );
  const secret = () => randomBytes(32).toString('base64url');
  const challenge = (value) =>
    createHash('sha256').update(value).digest('base64url');
  const proof = secret(),
    verifier = secret();
  const transaction = (
    await client.call('createTransaction', {
      body: {
        clientId: config.client.clientId,
        redirectUri: config.redirectUri,
        state: secret(),
        purpose: 'LOGIN',
        method: 'PHONE_OTP',
        codeChallenge: challenge(verifier),
        codeChallengeMethod: 'S256',
        initiatorChallenge: challenge(proof),
      },
    })
  ).data;
  const path = { transactionId: transaction.transactionId };
  const sent = (
    await client.call('createChallenge', {
      path,
      body: { channel: 'SMS', address: '+8613800000501' },
      initiatorProof: proof,
    })
  ).data;
  const delivery = await proxy.env.DB.prepare(
    'SELECT m.credential FROM auth_mock_delivery m JOIN auth_verification_challenge c ON c.delivery_id=m.delivery_id WHERE c.id=?',
  )
    .bind(sent.challengeId)
    .first();
  const verified = (
    await client.call('verifyChallenge', {
      path: { ...path, challengeId: sent.challengeId },
      body: { credential: delivery.credential },
      initiatorProof: proof,
    })
  ).data;
  await client.call('signInPhone', {
    path,
    body: { verificationProof: verified.verificationProof },
    initiatorProof: proof,
  });
  const completed = (
    await client.call('completeTransaction', {
      path,
      body: {},
      initiatorProof: proof,
    })
  ).data;
  const tokens = (
    await client.call('exchangeToken', {
      body: {
        grantType: 'authorization_code',
        clientId: config.client.clientId,
        code: completed.code,
        redirectUri: config.redirectUri,
        codeVerifier: verifier,
      },
    })
  ).data;
  const me = await client.identifyToken(tokens.accessToken);
  const binding = {
    accessToken: tokens.accessToken,
    userId: me.user.userId,
    loginSessionId: tokens.session.loginSessionId,
  };
  const sessionPort = {
    read: async () => binding,
    verifyCsrf: async (r) => r.headers.get('x-csrf-token') === 'isolated-test',
    assertCurrent: async () => {},
  };
  const bff = createAccountBff(client, sessionPort);
  const result = await bff(new Request(productOrigin + '/api/account/session'));
  assert.equal(result.status, 200);
  const view = await result.json();
  assert.equal(view.data.user.userId, me.user.userId);
  assert.equal(view.data.state, 'AUTHENTICATED');
  assert.ok(!JSON.stringify(view).includes(tokens.accessToken));
  assert.ok(!JSON.stringify(view).includes(tokens.refreshToken));
  const change = () =>
    new Request(productOrigin + '/api/account/profile', {
      method: 'PATCH',
      headers: {
        Origin: productOrigin,
        'X-CSRF-Token': 'isolated-test',
        'Idempotency-Key': 'club01-profile-idempotency',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName: 'Club Foundation',
        expectedVersion: me.user.version,
      }),
    });
  assert.equal((await bff(change())).status, 200);
  assert.equal((await bff(change())).status, 200);
  assert.equal(
    (await client.readAccount(binding)).user.displayName,
    'Club Foundation',
  );
  assert.deepEqual(
    (await client.call('listMyTenants', {}, { session: binding })).data.items,
    [],
  );
  const current = await client.call(
    'getCurrentSession',
    {},
    { session: binding },
  );
  assert.equal(current.data.clientId, config.client.clientId);
  await client.call(
    'logoutCurrent',
    { body: {}, idempotencyKey: secret() },
    { session: binding },
  );
  assert.equal(
    (await bff(new Request(productOrigin + '/api/account/session'))).status,
    401,
  );
  console.log(
    'PASS CLUB-01 real Auth mock phone login, trusted identity, BFF view, profile idempotency, tenant read and revoked-session rejection',
  );
} finally {
  await proxy.dispose();
}
