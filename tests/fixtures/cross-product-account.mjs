// AUTH12-03 / UAS-17/18/20/23/24/33: one Auth, both real product adapters.
import assert from 'node:assert/strict';
import { createClubSessionManager } from '../../lib/account/sessions.ts';

export async function exerciseCrossProductManagement({
  authDb,
  clubDb,
  client,
  key,
  browser,
  workApi,
  club,
  userId,
  preserved,
}) {
  // Only platform bootstrap is a fixture; all business state goes through real APIs.
  for (const permission of [
    'TENANT_CREATE',
    'CATALOG_WRITE',
    'SUBSCRIPTION_READ',
    'SUBSCRIPTION_WRITE',
  ])
    await authDb
      .prepare(
        "INSERT INTO auth_platform_permission(user_id,permission,status,granted_by,granted_at) VALUES (?,?,'ACTIVE',?,?)",
      )
      .bind(userId, permission, userId, Date.now())
      .run();
  const owner = await createClubSessionManager({
    db: clubDb,
    client,
    encryptionKey: key,
  });
  const session = await owner.sessions.read(browser.request('/session'));
  const central = async (operation, body, path) =>
    (
      await client.call(
        operation,
        { body, path, idempotencyKey: crypto.randomUUID() },
        { session, assertCurrent: () => owner.sessions.assertCurrent(session) },
      )
    ).data;
  const personalFeature = 'auth12.personal',
    seatFeature = 'auth12.seat';
  for (const featureId of [personalFeature, seatFeature])
    await central('createFeature', {
      featureId,
      product: 'SHARED',
      name: featureId,
      reason: 'Synthetic AUTH-12',
    });
  await central(
    'publishPlanVersion',
    {
      planVersion: 1,
      name: 'Synthetic AUTH-12',
      personalFeatureIds: [personalFeature],
      seatTypes: [
        {
          seatTypeId: 'auth12-seat',
          name: 'Synthetic seat',
          featureIds: [seatFeature],
        },
      ],
      reason: 'Synthetic AUTH-12',
    },
    { planId: 'auth12-plan' },
  );
  const tenant = await workApi('/platform/tenants', {
    name: 'Cross-product management',
    ownerUserId: userId,
    reason: 'Synthetic AUTH-12',
  });
  const root = '/tenants/' + tenant.tenantId;
  assert.deepEqual(await club(root), await workApi(root));
  const common = {
    planId: 'auth12-plan',
    planVersion: 1,
    startsAt: new Date(Date.now() - 60000).toISOString(),
    endsAt: new Date(Date.now() + 86400000).toISOString(),
    reason: 'Synthetic AUTH-12',
  };
  const personal = await club('/platform/subscriptions', {
    ...common,
    owner: { kind: 'USER', id: userId },
  });
  const subscription = await workApi('/platform/subscriptions', {
    ...common,
    owner: { kind: 'TENANT', id: tenant.tenantId },
    seatQuantities: { 'auth12-seat': 1 },
  });
  assert.deepEqual(
    await workApi('/subscriptions'),
    await club('/subscriptions'),
  );
  assert.deepEqual(
    await club(root + '/subscriptions'),
    await workApi(root + '/subscriptions'),
  );
  const member = (await club(root + '/members')).items.find(
    (m) => m.userId === userId,
  );
  const pool = (await workApi(root + '/seat-pools')).items[0];
  const assigned = (
    await club(root + '/seat-assignments', {
      subscriptionId: subscription.subscriptionId,
      seatTypeId: 'auth12-seat',
      membershipId: member.membershipId,
      expectedVersion: pool.version,
    })
  ).assignment;
  assert.deepEqual(
    await workApi(root + '/seat-assignments'),
    await club(root + '/seat-assignments'),
  );
  const check = async (api, scope) =>
    (
      await api('/entitlements/check', {
        scope,
        featureIds: [personalFeature, seatFeature],
      })
    ).decisions;
  const scope = { kind: 'TENANT', tenantId: tenant.tenantId };
  const before = await check(workApi, scope);
  // Each product has its own access expiry. Compare facts, while validating each
  // independently bounded validity deadline rather than assuming equal clocks.
  const facts = (decisions) =>
    decisions.map(({ validUntil, ...decision }) => {
      assert.ok(Date.parse(validUntil) > Date.now());
      assert.ok(Date.parse(validUntil) <= Date.parse(common.endsAt));
      return decision;
    });
  assert.deepEqual(facts(before), facts(await check(club, scope)));
  assert.ok(before.every((d) => d.allowed));
  assert.deepEqual(
    (await check(workApi, { kind: 'PERSONAL' })).map((d) => d.allowed),
    [true, false],
  );
  await workApi(
    root + '/seat-assignments/' + assigned.assignmentId + '/release',
    { expectedVersion: assigned.version },
  );
  assert.deepEqual(
    await workApi(root + '/seat-assignments?state=history'),
    await club(root + '/seat-assignments?state=history'),
  );
  assert.deepEqual(
    (await check(club, scope)).map((d) => d.allowed),
    [true, false],
  );
  await club(
    '/platform/subscriptions/' + personal.subscriptionId,
    {
      expectedVersion: personal.version,
      enabled: false,
      reason: 'Synthetic AUTH-12',
    },
    200,
    'PATCH',
  );
  assert.deepEqual(
    (await check(workApi, scope)).map((d) => d.allowed),
    [false, false],
  );
  assert.deepEqual(
    await workApi('/subscriptions'),
    await club('/subscriptions'),
  );
  await preserved();
  console.log(
    'PASS AUTH12-03 UAS-33: cross-product tenant, personal/tenant subscriptions, seat assignment/release/history and shared entitlement sources agree; local Home retained.',
  );
}
