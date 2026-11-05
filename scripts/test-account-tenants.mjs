// CLUB-05/UAS-12–16/21/35/42: actual Auth + product BFF, isolated D1 and directed invitations.
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
          ...(body ? { 'Idempotency-Key': crypto.randomUUID() } : {}),
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
      { body, path: params, idempotencyKey: crypto.randomUUID() },
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
  const staff = await login('+8613800000501'),
    owner = await login('+8613800000502'),
    member = await login('+8613800000503'),
    stranger = await login('+8613800000504');
  for (const permission of ['TENANT_CREATE', 'TENANT_READ', 'TENANT_STATUS'])
    await db
      .prepare(
        "INSERT INTO auth_platform_permission(user_id,permission,status,granted_by,granted_at) VALUES (?,?,'ACTIVE',?,?)",
      )
      .bind(staff.id, permission, staff.id, Date.now())
      .run();
  const alpha = await platform(staff, 'createTenant', {
      name: 'Club Alpha',
      ownerUserId: owner.id,
      reason: 'CLUB-05 isolated fixture',
    }),
    beta = await platform(staff, 'createTenant', {
      name: 'Club Beta',
      ownerUserId: owner.id,
      reason: 'CLUB-05 isolated fixture',
    });
  const root = '/tenants/' + alpha.tenantId,
    members = () => api(owner.b, root + '/members');
  assert.equal((await api(owner.b, '/tenants?limit=1')).items.length, 1);
  const first = await api(owner.b, '/tenants?limit=1');
  assert.ok(first.nextCursor);
  assert.equal(
    (
      await api(
        owner.b,
        '/tenants?limit=1&cursor=' + encodeURIComponent(first.nextCursor),
      )
    ).items.length,
    1,
  );
  assert.equal((await api(stranger.b, '/tenants')).items.length, 0);
  await api(stranger.b, root, undefined, 404);
  await api(stranger.b, root + '/members', undefined, 404);
  let invitation = await api(owner.b, root + '/invitations', {
    target: { kind: 'USER', value: member.id },
  });
  assert.equal(
    (await members()).items.length,
    1,
    'invitation does not prejoin',
  );
  await api(
    stranger.b,
    '/invitations/' + invitation.invitationId + '/accept',
    { expectedVersion: invitation.version },
    404,
  );
  assert.equal(
    (await api(member.b, '/invitations')).items[0].invitationId,
    invitation.invitationId,
  );
  const joined = await api(
    member.b,
    '/invitations/' + invitation.invitationId + '/accept',
    { expectedVersion: invitation.version },
  );
  let membership = joined.membership;
  await api(
    member.b,
    root + '/invitations',
    { target: { kind: 'USER', value: stranger.id } },
    403,
  );
  await api(
    member.b,
    root,
    { name: 'No', expectedVersion: alpha.version },
    403,
    'PATCH',
  );
  membership = await api(
    owner.b,
    root + '/members/' + membership.membershipId + '/role',
    { role: 'ADMIN', expectedVersion: membership.version },
    200,
    'PATCH',
  );
  await api(
    member.b,
    root + '/members/' + membership.membershipId + '/role',
    { role: 'MEMBER', expectedVersion: membership.version },
    403,
    'PATCH',
  );
  const tenant = await api(member.b, root);
  await api(
    member.b,
    root,
    { name: 'Updated Alpha', expectedVersion: tenant.version },
    200,
    'PATCH',
  );
  await api(
    owner.b,
    root,
    { name: 'Stale', expectedVersion: tenant.version },
    409,
    'PATCH',
  );
  invitation = await api(member.b, root + '/invitations', {
    target: { kind: 'PHONE', value: '+8613800000505' },
  });
  const newcomer = await login('+8613800000505');
  assert.equal(
    (await api(newcomer.b, '/invitations')).items[0].invitationId,
    invitation.invitationId,
  );
  const newMember = (
    await api(
      newcomer.b,
      '/invitations/' + invitation.invitationId + '/accept',
      { expectedVersion: invitation.version },
    )
  ).membership;
  const discarded = await api(owner.b, root + '/invitations', {
    target: { kind: 'EMAIL', value: 'future-club05@example.test' },
  });
  await api(
    owner.b,
    root + '/invitations/' + discarded.invitationId + '/revoke',
    { expectedVersion: discarded.version },
  );
  const myMember = (await members()).items.find((m) => m.userId === owner.id);
  const n = Date.now();
  await db
    .prepare(
      "INSERT INTO billing_plan_version VALUES ('club05-plan',1,'Fixture',?,?)",
    )
    .bind(staff.id, n)
    .run();
  await db
    .prepare("INSERT INTO billing_seat_type VALUES ('club05-seat','Fixture',?)")
    .bind(n)
    .run();
  await db
    .prepare(
      "INSERT INTO billing_subscription(id,owner_tenant_id,plan_id,plan_version,enabled,starts_at,ends_at,created_at,updated_at) VALUES ('club05-sub',?,'club05-plan',1,1,?,?,?,?)",
    )
    .bind(alpha.tenantId, n, n + 86400000, n, n)
    .run();
  await db
    .prepare(
      "INSERT INTO billing_seat_pool(subscription_id,tenant_id,seat_type_id,quantity) VALUES ('club05-sub',?,'club05-seat',3)",
    )
    .bind(alpha.tenantId)
    .run();
  for (const [id, m] of [
    ['owner', myMember],
    ['member', newMember],
  ])
    await db
      .prepare(
        "INSERT INTO billing_seat_assignment(id,subscription_id,seat_type_id,tenant_id,membership_id,user_id,status,assigned_at) VALUES (?,'club05-sub','club05-seat',?,?,?,'ASSIGNED',?)",
      )
      .bind(id, alpha.tenantId, m.membershipId, m.userId, n)
      .run();
  await api(member.b, root + '/members/' + newMember.membershipId + '/remove', {
    expectedVersion: newMember.version,
  });
  assert.equal(
    (
      await db
        .prepare("SELECT status FROM billing_seat_assignment WHERE id='member'")
        .first()
    ).status,
    'ENDED',
  );
  await api(
    owner.b,
    root + '/leave',
    { expectedVersion: myMember.version },
    409,
  );
  const updated = await api(owner.b, root);
  const transfer = await api(owner.b, root + '/ownership-transfers', {
    targetMembershipId: membership.membershipId,
    expectedVersion: updated.version,
  });
  await api(
    owner.b,
    '/ownership-transfers/' + transfer.transferId + '/accept',
    { expectedVersion: transfer.version },
    404,
  );
  assert.ok(
    (await api(member.b, '/ownership-transfers')).items.some(
      (t) => t.transferId === transfer.transferId,
    ),
  );
  const accepted = await api(
    member.b,
    '/ownership-transfers/' + transfer.transferId + '/accept',
    { expectedVersion: transfer.version },
  );
  assert.equal(accepted.previousOwner.role, 'MEMBER');
  assert.equal(accepted.owner.role, 'OWNER');
  assert.equal(
    (
      await db
        .prepare("SELECT status FROM billing_seat_assignment WHERE id='owner'")
        .first()
    ).status,
    'ASSIGNED',
  );
  await api(owner.b, root + '/leave', {
    expectedVersion: accepted.previousOwner.version,
  });
  assert.equal(
    (
      await db
        .prepare("SELECT status FROM billing_seat_assignment WHERE id='owner'")
        .first()
    ).status,
    'ENDED',
  );
  assert.equal(
    (await api(owner.b, '/tenants')).items[0].tenantId,
    beta.tenantId,
  );
  const current = (
    await client.call(
      'getPlatformTenant',
      { path: { tenantId: alpha.tenantId } },
      {
        session: await (
          await createClubSessionManager({ db, client, encryptionKey: key })
        ).sessions.read(staff.b.request('/session')),
      },
    )
  ).data;
  await platform(
    staff,
    'disableTenant',
    { expectedVersion: current.version, reason: 'Fixture disabled' },
    { tenantId: alpha.tenantId },
  );
  assert.equal((await api(member.b, '/tenants')).items[0].status, 'DISABLED');
  await api(member.b, root + '/members', undefined, 403);
  assert.equal((await api(member.b, '/session')).state, 'AUTHENTICATED');
  await api(owner.b, '/tenants', undefined, 403, 'GET', {
    Origin: 'http://foreign.test',
  });
  await api(owner.b, '/tenants?unexpected=1', undefined, 400);
  await api(
    owner.b,
    root + '/invitations',
    { target: { kind: 'USER', value: stranger.id }, actorId: staff.id },
    400,
  );
  process.stdout.write(
    'PASS CLUB-05: real BFF pagination, tenant isolation, directed invite before signup, roles, optimistic conflicts, revoke/remove, atomic seat release, accepted ownership handoff, disabled tenant and CSRF/input refusal\n',
  );
} finally {
  await proxy.dispose();
}
