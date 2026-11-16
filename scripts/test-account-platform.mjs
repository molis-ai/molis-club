// CLUB06-01/02/03/04: actual Auth + product BFF, isolated D1 and directed invitations.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { randomBytes } from 'node:crypto';
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
const config = configuration(),
  proxy = await getRustProxy({
    AUTH_ORIGIN: config.client.authOrigin,
    PROVIDER_STATE_KEY: randomBytes(32).toString('base64url'),
    UNIFIED_ACCOUNT_CONFIG: JSON.stringify({
      environmentId: 'unified-local',
      kind: 'LOCAL',
      authOrigin: config.client.authOrigin,
      deliveryMode: 'MOCK',
      providerMode: 'MOCK',
    }),
  });
const db = proxy.env.DB,
  key = randomBytes(32).toString('base64url'),
  client = createCentralAccountClient(config, (request) =>
    proxy.fetch(request),
  );
async function raw(request) {
  const owner = await createClubSessionManager({
    db,
    client,
    encryptionKey: key,
  });
  return new URL(request.url).pathname.includes('/auth/')
    ? createAuthenticationHandler(db, client, owner, key)(request)
    : owner.decorate(
        request,
        await createAccountBff(client, owner.sessions)(request),
      );
}
async function api(
  who,
  path,
  body,
  status = 200,
  method = body === undefined ? 'GET' : 'POST',
  headers = {},
) {
  const response = who.apply(
    await raw(
      who.request(path, {
        body,
        method,
        headers: {
          ...(body && path !== '/entitlements/check'
            ? { 'Idempotency-Key': crypto.randomUUID() }
            : {}),
          ...headers,
        },
      }),
    ),
  );
  const result = await response.json();
  assert.equal(response.status, status, JSON.stringify(result));
  return result.data;
}
async function login(address) {
  const b = browser();
  await api(b, '/session');
  const t = await api(b, '/auth/transactions', {
      purpose: 'LOGIN',
      method: 'PHONE_OTP',
    }),
    path = '/auth/transactions/' + t.handle + '/submit';
  const challenge = await api(b, path, { step: 'REQUEST_CHALLENGE', address });
  const delivery = await db
    .prepare(
      'SELECT m.credential FROM auth_mock_delivery m JOIN auth_verification_challenge c ON c.delivery_id=m.delivery_id WHERE c.canonical_target=? ORDER BY c.created_at DESC LIMIT 1',
    )
    .bind(address)
    .first();
  await api(b, path, {
    step: 'VERIFY_CHALLENGE',
    challengeHandle: challenge.challengeHandle,
    credential: delivery.credential,
  });
  await api(b, path, { step: 'CODE_LOGIN' });
  const { account } = await api(b, path, { step: 'COMPLETE' });
  return { b, id: account.user.userId };
}
async function platform(actor, operation, body, params) {
  const owner = await createClubSessionManager({
      db,
      client,
      encryptionKey: key,
    }),
    request = actor.b.request('/session');
  const session = await owner.sessions.read(request);
  return (
    await client.call(
      operation,
      {
        ...(body ? { body, idempotencyKey: crypto.randomUUID() } : {}),
        path: params,
      },
      { session, assertCurrent: () => owner.sessions.assertCurrent(session) },
    )
  ).data;
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
      .map((v) => v.trim())
      .filter(Boolean))
      await db.prepare(sql).run();

  const staff = await login('+8613800000701'),
    owner = await login('+8613800000702'),
    member = await login('+8613800000703');
  for (const permission of [
    'TENANT_CREATE',
    'TENANT_READ',
    'TENANT_STATUS',
    'CATALOG_WRITE',
    'SUBSCRIPTION_READ',
    'SUBSCRIPTION_WRITE',
    'AUDIT_READ',
  ])
    await db
      .prepare(
        "INSERT INTO auth_platform_permission(user_id,permission,status,granted_by,granted_at) VALUES (?,?,'ACTIVE',?,?)",
      )
      .bind(staff.id, permission, staff.id, Date.now())
      .run();
  const reason = 'CLUB07-01 CLUB07-02 CLUB07-03',
    central = (id, body, path) => platform(staff, id, body, path);
  let tenant = await api(staff.b, '/platform/tenants', {
    name: 'Platform tenant',
    ownerUserId: owner.id,
    reason,
  });
  assert.equal(tenant.ownerUserId, owner.id);
  assert.equal((await api(staff.b, '/tenants')).items.length, 0);
  await api(member.b, '/platform/tenants', undefined, 403);
  await api(
    member.b,
    '/platform/tenants',
    { name: 'Forbidden', ownerUserId: member.id, reason },
    403,
  );
  const root = '/tenants/' + tenant.tenantId;
  const { makeBillingFixture } =
    await import('../tests/fixtures/billing-catalog.mjs');
  const f = await makeBillingFixture(
    central,
    owner.id,
    tenant.tenantId,
    'club07',
  );
  let sub = await api(
    staff.b,
    '/platform/subscriptions/' + f.tenant.subscriptionId,
  );
  const path = '/platform/subscriptions/' + sub.subscriptionId;
  assert.equal((await api(staff.b, path + '/seat-pools')).items[0].quantity, 1);
  await api(staff.b, root + '/seat-pools', undefined, 404);
  await api(owner.b, path + '/seat-pools', undefined, 403);
  await api(member.b, '/platform/subscriptions', undefined, 403);
  const ownerMember = (await api(owner.b, root + '/members')).items[0],
    pool = (await api(owner.b, root + '/seat-pools')).items[0];
  const assigned = await api(owner.b, root + '/seat-assignments', {
    subscriptionId: sub.subscriptionId,
    seatTypeId: f.seatType,
    membershipId: ownerMember.membershipId,
    expectedVersion: pool.version,
  });
  await api(
    staff.b,
    path,
    {
      expectedVersion: sub.version,
      seatQuantities: { [f.seatType]: 0 },
      reason,
    },
    409,
    'PATCH',
  );
  assert.equal((await api(staff.b, path)).version, sub.version);
  sub = await api(
    staff.b,
    path,
    {
      expectedVersion: sub.version,
      seatQuantities: { [f.seatType]: 2 },
      reason,
    },
    200,
    'PATCH',
  );
  assert.equal(sub.endsAt, f.tenant.endsAt);
  await api(
    staff.b,
    path,
    {
      expectedVersion: sub.version,
      owner: { kind: 'USER', id: member.id },
      reason,
    },
    400,
    'PATCH',
  );
  await api(staff.b, path + '?ownerId=' + member.id, undefined, 400);
  sub = await api(
    staff.b,
    path,
    { expectedVersion: sub.version, enabled: false, reason },
    200,
    'PATCH',
  );
  const oldEnd = sub.endsAt;
  sub = await api(staff.b, path + '/renew', {
    expectedVersion: sub.version,
    endsAt: new Date(Date.parse(sub.endsAt) + 86400000).toISOString(),
    reason,
  });
  assert.equal(sub.enabled, false);
  assert.ok(sub.endsAt > oldEnd);
  sub = await api(
    staff.b,
    path,
    { expectedVersion: sub.version, enabled: true, reason },
    200,
    'PATCH',
  );
  tenant = await api(
    staff.b,
    '/platform/tenants/' + tenant.tenantId + '/disable',
    { expectedVersion: tenant.version, reason },
  );
  await api(owner.b, root + '/subscriptions', undefined, 403);
  assert.equal(
    (await api(staff.b, path + '/seat-pools')).items[0].assignedCount,
    1,
  );
  sub = await api(
    staff.b,
    path,
    {
      expectedVersion: sub.version,
      seatQuantities: { [f.seatType]: 3 },
      reason,
    },
    200,
    'PATCH',
  );
  tenant = await api(
    staff.b,
    '/platform/tenants/' + tenant.tenantId + '/enable',
    { expectedVersion: tenant.version, reason },
  );
  assert.equal(
    (await api(owner.b, root + '/seat-assignments')).items[0].assignmentId,
    assigned.assignment.assignmentId,
  );
  await api(
    owner.b,
    root + '/seat-assignments/' + assigned.assignment.assignmentId + '/release',
    { expectedVersion: assigned.assignment.version },
  );
  sub = await api(
    staff.b,
    path,
    {
      expectedVersion: sub.version,
      seatQuantities: { [f.seatType]: 0 },
      reason,
    },
    200,
    'PATCH',
  );
  assert.equal((await api(staff.b, path + '/seat-pools')).items[0].quantity, 0);
  assert.ok(
    (await api(staff.b, '/platform/audit-events')).items.some(
      (a) => a.operation === 'subscription.update',
    ),
  );
  await api(owner.b, '/platform/audit-events', undefined, 403);
  // BFF independently enforces CSRF and origin on platform mutations.
  await api(
    staff.b,
    path,
    { expectedVersion: sub.version, enabled: false, reason },
    403,
    'PATCH',
    { 'X-CSRF-Token': 'invalid' },
  );
  await api(
    staff.b,
    path,
    { expectedVersion: sub.version, enabled: false, reason },
    403,
    'PATCH',
    { Origin: 'https://untrusted.example' },
  );
  await db
    .prepare(
      "UPDATE auth_platform_permission SET status='REVOKED',revoked_at=?,version=version+1 WHERE user_id=? AND permission='SUBSCRIPTION_WRITE'",
    )
    .bind(Date.now(), staff.id)
    .run();
  await api(
    staff.b,
    path,
    { expectedVersion: sub.version, enabled: false, reason },
    403,
    'PATCH',
  );
  process.stdout.write(
    'PASS CLUB-07: real BFF platform tenant/subscription lifecycle, nonmember inventory, disabled tenant, atomic capacity conflict/reclaim, audit and current permission/CSRF/origin/input denial\n',
  );
} finally {
  await proxy.dispose();
}
