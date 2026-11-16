import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readClubAccountConfig } from '../lib/account/config.ts';
import { createCentralAccountClient } from '../lib/account/client.ts';
import {
  createAccountBff,
  mappedCentralOperation,
} from '../lib/account/bff.ts';
import { validateNamed } from '../lib/account/contracts/validate.ts';
import fixtures from '../lib/account/contracts/fixtures.json' with { type: 'json' };
import snapshot from '../lib/account/contracts/snapshot.json' with { type: 'json' };
import { operations } from '../lib/account/contract.ts';

export const configValue = () => ({
  applicationId: 'molis-club-unified-local-app',
  redirectUri: 'http://127.0.0.1:3000/account/callback',
  client: {
    environmentId: 'unified-local',
    authOrigin: 'http://127.0.0.1:8787',
    productOrigin: 'http://127.0.0.1:3000',
    clientId: 'molis-club-unified-local',
    policyProfile: 'unified-account-v2',
    redirectAllowlist: ['http://127.0.0.1:3000/account/callback'],
    environmentKind: 'LOCAL',
    deliveryMode: 'MOCK',
    providerMode: 'MOCK',
  },
});
const configured = () => readClubAccountConfig(JSON.stringify(configValue()));
const binding = () => ({
  accessToken: crypto.randomUUID(),
  userId: 'test-user',
  loginSessionId: 'test-session',
});
const me = () => ({
  user: {
    issuer: 'http://127.0.0.1:8787',
    userId: 'test-user',
    displayName: 'Test',
    email: null,
    avatarUrl: null,
    version: 1,
  },
  session: {
    loginSessionId: 'test-session',
    applicationId: 'molis-club-unified-local-app',
    clientId: 'molis-club-unified-local',
    authenticatedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    idleExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    absoluteExpiresAt: new Date(Date.now() + 172_800_000).toISOString(),
    sessionRevision: 0,
  },
  loginMethods: [],
  passwordEnabled: false,
  platformCapabilities: [],
});
const envelope = (data, status = 200) =>
  Response.json({ data, requestId: crypto.randomUUID() }, { status });
function harness(handler = () => envelope(me())) {
  const requests = [];
  const client = createCentralAccountClient(configured(), async (request) => {
    requests.push(request);
    return handler(request);
  });
  return { client, requests };
}
const req = (
  path,
  { body, method = body === undefined ? 'GET' : 'POST', headers = {} } = {},
) =>
  new Request('http://127.0.0.1:3000/api/account' + path, {
    method,
    headers: {
      ...headers,
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
const port = (session = binding()) => ({
  read: async () => session,
  verifyCsrf: async (r) => r.headers.get('x-csrf-token') === 'test-csrf',
  assertCurrent: async () => {},
});

void test('CLUB-01/UAS-01/26: pinned Auth bytes, generated types and every shared fixture stay aligned', () => {
  for (const [file, digest] of Object.entries(snapshot.files))
    assert.equal(
      createHash('sha256')
        .update(
          readFileSync(
            new URL('../lib/account/contracts/' + file, import.meta.url),
          ),
        )
        .digest('hex'),
      digest,
      file,
    );
  execFileSync(process.execPath, ['scripts/account-contracts.mjs', '--check'], {
    cwd: new URL('..', import.meta.url),
  });
  for (const fixture of fixtures.fixtures)
    assert.equal(
      validateNamed(fixture.schema, fixture.value),
      fixture.valid,
      fixture.name,
    );
  for (const op of operations.filter((o) =>
    o.path.startsWith('/api/account/'),
  )) {
    const mapped = mappedCentralOperation(op.operation.operationId);
    if (op.operation.operationId.startsWith('product_'))
      assert.equal(mapped, op.operation.operationId.slice(8));
  }
});

void test('CLUB-01/UAS-11/28: deployment configuration is explicit, fixed-origin and mock-isolated', () => {
  assert.equal(readClubAccountConfig(undefined), null);
  assert.ok(configured());
  assert.ok(Object.isFrozen(configured().client));
  for (const mutate of [
    (c) => {
      c.client.productOrigin = 'https://untrusted.test';
    },
    (c) => {
      c.client.authOrigin = 'http://example.test';
    },
    (c) => {
      c.client.authOrigin = 'http://127.0.0.1:8787/path';
    },
    (c) => {
      c.client.authOrigin = 'http://name:password@127.0.0.1:8787';
    },
    (c) => {
      c.client.environmentKind = 'PRODUCTION';
    },
    (c) => {
      c.client.redirectAllowlist = ['http://127.0.0.1:3000/*'];
    },
    (c) => {
      c.redirectUri = 'http://127.0.0.1:3000/account/callback?state=x';
      c.client.redirectAllowlist = [c.redirectUri];
    },
    (c) => {
      c.redirectUri = 'http://127.0.0.1:3000/other';
      c.client.redirectAllowlist = [c.redirectUri];
    },
    (c) => {
      c.redirectUri = 'http://127.0.0.1:3000/other/../account/callback';
      c.client.redirectAllowlist = [c.redirectUri];
    },
    (c) => {
      c.subjectUserId = 'spoof';
    },
  ]) {
    const c = configValue();
    mutate(c);
    assert.throws(() => readClubAccountConfig(JSON.stringify(c)), {
      message: 'UNIFIED_CONFIGURATION_INVALID',
    });
  }
});

void test('CLUB-01/UAS-01/11/26: fixed server operations preserve versions and idempotency without forwarding browser headers', async () => {
  const { client, requests } = harness((r) =>
    new URL(r.url).pathname.endsWith('/profile')
      ? envelope({ ...me().user, displayName: 'Changed', version: 2 })
      : envelope(me()),
  );
  const key = crypto.randomUUID(),
    session = binding();
  const result = await client.call(
    'updateProfile',
    {
      body: { displayName: 'Changed', expectedVersion: 1 },
      idempotencyKey: key,
    },
    { session },
  );
  assert.equal(result.data.version, 2);
  const sent = requests.at(-1);
  assert.equal(sent.url, 'http://127.0.0.1:8787/api/v2/users/me/profile');
  assert.equal(sent.headers.get('Origin'), 'http://127.0.0.1:3000');
  assert.equal(sent.headers.get('Idempotency-Key'), key);
  assert.equal(
    sent.headers.get('Authorization'),
    'Bearer ' + session.accessToken,
  );
  assert.equal(sent.headers.has('Cookie'), false);
  assert.equal(sent.redirect, 'manual');
  assert.equal(sent.credentials, 'omit');
  assert.deepEqual(await sent.json(), {
    displayName: 'Changed',
    expectedVersion: 1,
  });
  await assert.rejects(client.call('https://untrusted.test', {}), {
    message: 'NOT_FOUND',
  });
  await assert.rejects(
    client.call(
      'updateProfile',
      {
        body: {
          displayName: 'Changed',
          expectedVersion: 1,
          subjectUserId: 'spoof',
        },
        idempotencyKey: key,
      },
      { session },
    ),
    { message: 'INVALID_REQUEST' },
  );
  await assert.rejects(
    client.call('getTenant', { path: { tenantId: '../other' } }, { session }),
    { message: 'INVALID_REQUEST' },
  );
  await assert.rejects(
    client.call(
      'listMyTenants',
      { query: { limit: 20, url: 'https://untrusted.test' } },
      { session },
    ),
    { message: 'INVALID_REQUEST' },
  );
  await assert.rejects(
    client.call(
      'updateProfile',
      { body: { displayName: 'Changed', expectedVersion: 1 } },
      { session },
    ),
    { message: 'INVALID_REQUEST' },
  );
  assert.equal(requests.filter((r) => r.method === 'PATCH').length, 1);
});

void test('CLUB-01/UAS-11/26: issuer, application, client, user and login-session mismatches reject before mutation', async () => {
  for (const change of [
    (v) => {
      v.user.issuer = 'https://other.test';
    },
    (v) => {
      v.user.userId = 'other';
    },
    (v) => {
      v.session.applicationId = 'other';
    },
    (v) => {
      v.session.clientId = 'other';
    },
    (v) => {
      v.session.loginSessionId = 'other';
    },
    (v) => {
      v.session.idleExpiresAt = new Date(0).toISOString();
    },
  ]) {
    const { client, requests } = harness(() => {
      const value = me();
      change(value);
      return envelope(value);
    });
    await assert.rejects(
      client.call(
        'updateProfile',
        {
          body: { displayName: 'Changed', expectedVersion: 1 },
          idempotencyKey: crypto.randomUUID(),
        },
        { session: binding() },
      ),
    );
    assert.equal(
      requests.some((r) => r.method === 'PATCH'),
      false,
    );
  }
});

void test('CLUB-01/UAS-26: upstream errors preserve status/code/retry while invalid bodies and redirects fail closed', async () => {
  const secret = 'sensitive-' + crypto.randomUUID();
  for (const handler of [
    () => new Response(secret, { status: 500 }),
    () =>
      Response.json({
        data: { ...me(), accessToken: secret },
        requestId: 'test',
      }),
    () =>
      Response.json(
        {
          error: { code: 'AUTH_UNAVAILABLE', message: secret },
          requestId: 'test',
        },
        { status: 503 },
      ),
    () =>
      new Response(null, {
        status: 302,
        headers: { Location: 'https://untrusted.test' },
      }),
    () => {
      throw new Error(secret);
    },
    () =>
      new Response('x'.repeat(2 * 1024 * 1024 + 1), {
        headers: { 'content-type': 'application/json' },
      }),
  ]) {
    const { client } = harness(handler);
    try {
      await client.readAccount(binding());
      assert.fail('must reject');
    } catch (e) {
      assert.equal(e.status, 503);
      assert.ok(!JSON.stringify(e).includes(secret));
    }
  }
  const { client } = harness(() =>
    Response.json(
      {
        requestId: 'upstream',
        error: { code: 'RATE_LIMITED', retryAfterSeconds: 30 },
      },
      { status: 429 },
    ),
  );
  await assert.rejects(
    client.readAccount(binding()),
    (e) =>
      e.status === 429 &&
      e.envelope.error.retryAfterSeconds === 30 &&
      e.envelope.error.code === 'RATE_LIMITED',
  );
});

void test('CLUB-01/UAS-11/26: BFF session is anonymous without trusted port and exposes no credentials when authenticated', async () => {
  const { client, requests } = harness();
  const anonymous = createAccountBff(client);
  assert.deepEqual(
    (
      await (
        await anonymous(
          req('/session', { headers: { Cookie: 'userId=spoof; token=spoof' } }),
        )
      ).json()
    ).data,
    { state: 'ANONYMOUS' },
  );
  assert.equal(requests.length, 0);
  for (const r of [
    req('/session?userId=spoof'),
    req('/session', {
      headers: { Authorization: 'Bearer ' + binding().accessToken },
    }),
    req('/session', { headers: { Origin: 'https://untrusted.test' } }),
    req('/session', { headers: { 'Sec-Fetch-Site': 'cross-site' } }),
  ])
    assert.ok((await anonymous(r)).status >= 400);
  const bff = createAccountBff(client, port());
  const result = await bff(req('/session'));
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('cache-control'), 'no-store');
  const value = await result.json();
  assert.equal(value.data.state, 'AUTHENTICATED');
  assert.ok(validateNamed('AccountViewResponse', value));
  assert.ok(!JSON.stringify(value).includes('accessToken'));
});

void test('CLUB-01/UAS-11/26: BFF validates same-origin CSRF, fixed scope/path and stale sessions around I/O', async () => {
  const { client, requests } = harness((r) =>
    new URL(r.url).pathname.endsWith('/profile')
      ? envelope({ ...me().user, version: 2 })
      : envelope(me()),
  );
  const bff = createAccountBff(client, port());
  const headers = {
    Origin: 'http://127.0.0.1:3000',
    'X-CSRF-Token': 'test-csrf',
    'Idempotency-Key': crypto.randomUUID(),
  };
  assert.equal(
    (
      await bff(
        req('/profile', {
          method: 'PATCH',
          body: { displayName: 'new', expectedVersion: 1 },
          headers,
        }),
      )
    ).status,
    200,
  );
  for (const h of [
    { ...headers, 'X-CSRF-Token': 'wrong' },
    { ...headers, Origin: 'https://untrusted.test' },
  ])
    assert.equal(
      (
        await bff(
          req('/profile', {
            method: 'PATCH',
            body: { displayName: 'new', expectedVersion: 1 },
            headers: h,
          }),
        )
      ).status,
      403,
    );
  assert.equal(
    (
      await bff(
        req('/profile', {
          method: 'PATCH',
          body: { displayName: 'new', expectedVersion: 1, clientId: 'spoof' },
          headers,
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await bff(req('/tenants/a/members?limit=10&limit=20'))).status,
    400,
  );
  assert.equal((await bff(req('/tenants/a%2Fother'))).status, 400);
  assert.equal((await bff(req('/tenants/%FF'))).status, 400);
  assert.equal((await bff(req('/tenants/%ZZ'))).status, 400);
  assert.equal(
    (await bff(req('/proxy?url=https://untrusted.test'))).status,
    404,
  );
  assert.equal(requests.filter((r) => r.method === 'PATCH').length, 1);
  const stopped = {
    ...port(),
    assertCurrent: async () => {
      throw new Error('revoked session secret');
    },
  };
  assert.equal(
    (await createAccountBff(client, stopped)(req('/session'))).status,
    503,
  );
});

void test('CLUB-01: profile and login methods use only Auth me and preserve server display labels', async () => {
  const value = me();
  value.user.version = 7;
  value.loginMethods = [{ bindingId: 'binding-phone', type: 'PHONE', maskedLabel: 'Auth-owned display label', verified: true, usableForLogin: true }];
  const { client, requests } = harness(() => envelope(value));
  const context = { session: binding() };
  const profile = await client.call('getMe', {}, context);
  const methods = await client.call('listLoginMethods', {}, context);
  assert.deepEqual(methods.data, { loginMethods: profile.data.loginMethods, version: profile.data.user.version });
  assert.ok(requests.every((r) => new URL(r.url).pathname === '/api/v2/users/me'));
  await assert.rejects(client.call('listLoginMethods', { body: {} }, context));
  const wrong = harness(() => envelope({ ...value, user: { ...value.user, userId: 'other-user' } }));
  await assert.rejects(wrong.client.call('listLoginMethods', {}, context), (e) => e.envelope.error.code === 'POLICY_MISMATCH');
});
