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
  await api(b, path, { step: 'PHONE_LOGIN' });
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

  const staff = await login('+8613800000601'),
    member = await login('+8613800000602'),
    outsider = await login('+8613800000603');
  for (const permission of [
    'TENANT_CREATE',
    'TENANT_READ',
    'TENANT_STATUS',
    'CATALOG_WRITE',
    'SUBSCRIPTION_READ',
    'SUBSCRIPTION_WRITE',
  ])
    await db
      .prepare(
        "INSERT INTO auth_platform_permission(user_id,permission,status,granted_by,granted_at) VALUES (?,?,'ACTIVE',?,?)",
      )
      .bind(staff.id, permission, staff.id, Date.now())
      .run();
  const central = (id, body, path) => platform(staff, id, body, path);
  const tenant = await central('createTenant', {
      name: 'Billing Alpha',
      ownerUserId: staff.id,
      reason: 'CLUB-06 isolated fixture',
    }),
    beta = await central('createTenant', {
      name: 'Billing Beta',
      ownerUserId: staff.id,
      reason: 'CLUB-06 isolated fixture',
    });
  const root = '/tenants/' + tenant.tenantId,
    inv = await api(staff.b, root + '/invitations', {
      target: { kind: 'USER', value: member.id },
    });
  const membership = (
    await api(member.b, '/invitations/' + inv.invitationId + '/accept', {
      expectedVersion: inv.version,
    })
  ).membership;
  const me = (await api(staff.b, root + '/members')).items.find(
    (m) => m.userId === staff.id,
  );
  const { makeBillingFixture } =
    await import('../tests/fixtures/billing-catalog.mjs');
  const fixture = await makeBillingFixture(
    central,
    staff.id,
    tenant.tenantId,
    'club06',
  );
  let sub = fixture.tenant;
  const pool = async () => (await api(staff.b, root + '/seat-pools')).items[0];
  const check = async (who, scope) =>
    (
      await api(who, '/entitlements/check', {
        scope,
        featureIds: fixture.features,
      })
    ).decisions;
  assert.equal(
    (await api(staff.b, '/catalog/features?limit=1')).items.length,
    1,
  );
  const first = await api(staff.b, '/catalog/features?limit=1');
  assert.ok(first.nextCursor);
  assert.notEqual(
    (
      await api(
        staff.b,
        '/catalog/features?limit=1&cursor=' +
          encodeURIComponent(first.nextCursor),
      )
    ).items[0].featureId,
    first.items[0].featureId,
  );
  assert.equal(
    (await api(staff.b, '/subscriptions')).items[0].subscriptionId,
    fixture.personal.subscriptionId,
  );
  assert.equal(
    (await api(staff.b, root + '/subscriptions')).items[0].subscriptionId,
    sub.subscriptionId,
  );
  await api(member.b, root + '/seat-pools', undefined, 403);
  await api(outsider.b, root + '/subscriptions', undefined, 404);
  const p = await pool();
  const assign = {
    subscriptionId: sub.subscriptionId,
    seatTypeId: fixture.seatType,
    membershipId: me.membershipId,
    expectedVersion: p.version,
  };
  await api(member.b, root + '/seat-assignments', assign, 403);
  let a = (await api(staff.b, root + '/seat-assignments', assign)).assignment;
  assert.equal((await pool()).availableCount, 0);
  await api(
    staff.b,
    root + '/seat-assignments',
    { ...assign, membershipId: membership.membershipId },
    409,
  );
  await assert.rejects(
    () =>
      central(
        'updateSubscription',
        {
          expectedVersion: sub.version,
          reason: 'Cannot silently evict',
          seatQuantities: { [fixture.seatType]: 0 },
        },
        { subscriptionId: sub.subscriptionId },
      ),
    (error) =>
      error.status === 409 && error.envelope.error.code === 'CAPACITY_CONFLICT',
  );
  let d = await check(staff.b, { kind: 'TENANT', tenantId: tenant.tenantId });
  assert.ok(d.every((v) => v.allowed));
  assert.equal(d.find((v) => v.featureId === fixture.shared).sources.length, 2);
  d = await check(staff.b, { kind: 'PERSONAL' });
  assert.equal(d.find((v) => v.featureId === fixture.paid).allowed, false);
  d = await check(staff.b, { kind: 'TENANT', tenantId: beta.tenantId });
  assert.equal(d.find((v) => v.featureId === fixture.paid).allowed, false);
  const moved = await api(
    staff.b,
    root + '/seat-assignments/' + a.assignmentId + '/reassign',
    { targetMembershipId: membership.membershipId, expectedVersion: a.version },
  );
  assert.equal(moved.endedAssignment.endReason, 'REASSIGNED');
  a = moved.assignment;
  assert.equal(
    (await api(member.b, root + '/seat-assignments?state=current')).items[0]
      .userId,
    member.id,
  );
  assert.equal(
    (await api(member.b, root + '/seat-assignments?state=history')).items
      .length,
    0,
  );
  await api(
    member.b,
    root + '/seat-assignments/' + a.assignmentId + '/release',
    { expectedVersion: a.version },
    403,
  );
  d = await check(staff.b, { kind: 'TENANT', tenantId: tenant.tenantId });
  assert.equal(d.find((v) => v.featureId === fixture.paid).allowed, false);
  assert.equal(d.find((v) => v.featureId === fixture.shared).sources.length, 1);
  d = await check(member.b, { kind: 'TENANT', tenantId: tenant.tenantId });
  assert.equal(d.find((v) => v.featureId === fixture.paid).allowed, true);
  // Expiry retains capacity and current assignment, and cannot grant entitlements.
  sub = await central(
    'updateSubscription',
    {
      expectedVersion: sub.version,
      reason: 'Expire fixture',
      endsAt: new Date(Date.now() - 1000).toISOString(),
    },
    { subscriptionId: sub.subscriptionId },
  );
  assert.equal(sub.status, 'EXPIRED');
  assert.equal((await pool()).assignedCount, 1);
  assert.ok(
    !(
      await check(member.b, { kind: 'TENANT', tenantId: tenant.tenantId })
    ).some((v) => v.allowed),
  );
  await api(
    staff.b,
    root + '/seat-assignments/' + a.assignmentId + '/reassign',
    { targetMembershipId: me.membershipId, expectedVersion: a.version },
    409,
  );
  sub = await central(
    'renewSubscription',
    {
      expectedVersion: sub.version,
      endsAt: new Date(Date.now() + 86400000).toISOString(),
      reason: 'Renew retained fixture',
    },
    { subscriptionId: sub.subscriptionId },
  );
  assert.equal(
    (await api(member.b, root + '/seat-assignments')).items[0].assignmentId,
    a.assignmentId,
  );
  assert.ok(
    (await check(member.b, { kind: 'TENANT', tenantId: tenant.tenantId })).find(
      (v) => v.featureId === fixture.paid,
    ).allowed,
  );
  await api(
    staff.b,
    root + '/seat-assignments/' + a.assignmentId + '/release',
    { expectedVersion: a.version },
  );
  sub = await central(
    'updateSubscription',
    {
      expectedVersion: sub.version,
      reason: 'Reclaimed before capacity reduction',
      seatQuantities: { [fixture.seatType]: 0 },
    },
    { subscriptionId: sub.subscriptionId },
  );
  assert.equal((await pool()).quantity, 0);
  assert.ok(
    (await api(staff.b, root + '/seat-assignments?state=history')).items.some(
      (v) => v.endReason === 'RELEASED',
    ),
  );
  assert.equal(
    (await api(member.b, root + '/seat-assignments?state=history')).items
      .length,
    1,
  );
  assert.equal(
    (await api(member.b, root + '/seat-assignments?state=history')).items[0]
      .userId,
    member.id,
  );
  await api(staff.b, root + '/seat-pools?unknown=1', undefined, 400);
  await api(
    staff.b,
    root + '/seat-assignments',
    { ...assign, actorId: member.id },
    400,
  );
  await api(
    staff.b,
    '/entitlements/check',
    {
      scope: { kind: 'TENANT', tenantId: tenant.tenantId },
      featureIds: fixture.features,
    },
    403,
    'POST',
    { Origin: 'http://foreign.test' },
  );
  // A new membership must not revive old seats; changing type must explicitly reclaim first.
  sub = await central(
    'updateSubscription',
    {
      expectedVersion: sub.version,
      reason: 'Capacity for membership fixture',
      seatQuantities: { [fixture.seatType]: 1 },
    },
    { subscriptionId: sub.subscriptionId },
  );
  const beforeLeave = (
    await api(staff.b, root + '/seat-assignments', {
      ...assign,
      membershipId: membership.membershipId,
      expectedVersion: (await pool()).version,
    })
  ).assignment;
  await api(member.b, root + '/leave', { expectedVersion: membership.version });
  await api(member.b, root + '/seat-assignments', undefined, 404);
  assert.equal(
    (await api(staff.b, root + '/seat-assignments?state=history')).items.find(
      (a) => a.assignmentId === beforeLeave.assignmentId,
    ).endReason,
    'MEMBER_LEFT',
  );
  const reinvite = await api(staff.b, root + '/invitations', {
    target: { kind: 'USER', value: member.id },
  });
  const rejoined = (
    await api(member.b, '/invitations/' + reinvite.invitationId + '/accept', {
      expectedVersion: reinvite.version,
    })
  ).membership;
  assert.notEqual(rejoined.membershipId, membership.membershipId);
  assert.equal(
    (await api(member.b, root + '/seat-assignments')).items.length,
    0,
  );
  assert.ok(
    !(
      await check(member.b, { kind: 'TENANT', tenantId: tenant.tenantId })
    ).some((d) => d.allowed),
  );
  const fresh = (
    await api(staff.b, root + '/seat-assignments', {
      ...assign,
      membershipId: rejoined.membershipId,
      expectedVersion: (await pool()).version,
    })
  ).assignment;
  const replacementType = 'club06-new-seat';
  await central(
    'publishPlanVersion',
    {
      planVersion: 2,
      name: 'Updated collaboration',
      personalFeatureIds: [fixture.personalFeature, fixture.shared],
      seatTypes: [
        {
          seatTypeId: replacementType,
          name: 'Replacement seat',
          featureIds: [fixture.paid],
        },
      ],
      reason: 'Type change fixture',
    },
    { planId: sub.planId },
  );
  const changeType = () =>
    central(
      'updateSubscription',
      {
        expectedVersion: sub.version,
        plan: { planId: sub.planId, planVersion: 2 },
        seatQuantities: { [replacementType]: 1 },
        reason: 'Explicitly replace reclaimed type',
      },
      { subscriptionId: sub.subscriptionId },
    );
  await assert.rejects(
    changeType,
    (error) =>
      error.status === 409 && error.envelope.error.code === 'CAPACITY_CONFLICT',
  );
  await api(
    staff.b,
    root + '/seat-assignments/' + fresh.assignmentId + '/release',
    { expectedVersion: fresh.version },
  );
  sub = await changeType();
  assert.equal((await pool()).seatTypeId, replacementType);
  assert.equal((await pool()).assignedCount, 0);
  const current = await central('getPlatformTenant', undefined, {
    tenantId: tenant.tenantId,
  });
  await central(
    'disableTenant',
    { expectedVersion: current.version, reason: 'Disabled fixture' },
    { tenantId: tenant.tenantId },
  );
  await api(member.b, root + '/seat-assignments', undefined, 403);
  await api(
    staff.b,
    '/entitlements/check',
    {
      scope: { kind: 'TENANT', tenantId: tenant.tenantId },
      featureIds: fixture.features,
    },
    403,
  );
  assert.ok(
    (await check(staff.b, { kind: 'PERSONAL' })).find(
      (v) => v.featureId === fixture.personalFeature,
    ).allowed,
  );
  process.stdout.write(
    'PASS CLUB-06: real BFF catalog/subscriptions, pagination, role/scope isolation, assign/reassign/release/history, expiry/renewal, capacity reduction, entitlement union and source removal, disabled tenant and CSRF/input refusals\n',
  );
} finally {
  await proxy.dispose();
}
