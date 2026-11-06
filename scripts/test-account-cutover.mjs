// WORK09-01/02/03 CLUB09-01/02/03: one real Auth, actual Work Host and Club BFF, synthetic data only.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { randomBytes, createHash } from 'node:crypto';
import net from 'node:net';
import { createCentralAccountClient } from '../lib/account/client.ts';
import { createClubSessionManager } from '../lib/account/sessions.ts';
import { createAuthenticationHandler } from '../lib/account/auth-http.ts';
import { createAccountBff } from '../lib/account/bff.ts';
import { createBusinessNotesHandler } from '../lib/account/business-notes.ts';
import { retiredAccountEntry } from '../lib/account/retired-entry.ts';
import {
  inventoryBusinessIdentities,
  applyBusinessIdentityDecision,
} from '../lib/account/business-migration.mjs';
import { browser, configuration } from '../tests/fixtures/account-sessions.mjs';
import { exerciseCrossProductManagement } from '../tests/fixtures/cross-product-account.mjs';
const source = process.env.MOLIS_AUTH_SOURCE,
  work = process.env.MOLIS_WORK_SOURCE;
assert.ok(
  source && work && isAbsolute(source) && isAbsolute(work),
  'Explicit Auth and Work source paths required',
);
const load = (root, file) => import(pathToFileURL(resolve(root, file)).href);
const { getRustProxy, initializeLocalRuntime } = await load(
  source,
  'worker/scripts/local-runtime.mjs',
);
const { seedSynthetic, targets } = await load(
  source,
  'worker/scripts/account-migration/synthetic.mjs',
);
const { inventory } = await load(
  source,
  'worker/scripts/account-migration/inventory.mjs',
);
const { applyRehearsal, rollbackRehearsal } = await load(
  source,
  'worker/scripts/account-migration/cutover.mjs',
);
const { createMolisWorkLocalHost } = await load(
  work,
  'apps/local-host/dist/index.js',
);
const { createDesktopWebHost, withMolisWorkProjectCatalog: withCatalog } =
  await load(work, 'apps/desktop/dist/index.js');
const { createLazyFileSecretStore } = await load(
  work,
  'packages/storage/dist/index.js',
);
const { LOCAL_PERSON_ACTOR_ID } = await load(
  work,
  'packages/contracts/dist/platform/actions.js',
);
process.env.MOLIS_WORK_SECRET_BACKEND = 'file';
process.env.MOLIS_WORK_ENCRYPTION_KEY = '';
const secret = () => randomBytes(32).toString('base64url');
const home = realpathSync(await mkdtemp(join(tmpdir(), 'work-club09-'))),
  control = secret(),
  key = secret();
const config = configuration(),
  authOrigin = config.client.authOrigin;
const proxy = await getRustProxy({
  AUTH_ORIGIN: authOrigin,
  PROVIDER_STATE_KEY: secret(),
  UNIFIED_ACCOUNT_CONFIG: JSON.stringify({
    environmentId: 'unified-local',
    kind: 'LOCAL',
    authOrigin,
    deliveryMode: 'MOCK',
    providerMode: 'MOCK',
  }),
});
const clubProxy = await getRustProxy({ AUTH_ORIGIN: authOrigin }),
  db = clubProxy.env.DB;
const probe = net.createServer();
await new Promise((r) => probe.listen(0, '127.0.0.1', r));
const port = probe.address().port,
  origin = 'http://127.0.0.1:' + port;
await new Promise((r) => probe.close(r));
const workConfig = {
  ...config.client,
  productOrigin: origin,
  clientId: targets[0].newClientId,
  applicationId: 'molis-work-unified-local-app',
  redirectAllowlist: [origin + '/account/callback'],
};
let host,
  server,
  offline = false,
  refreshes = 0;
const client = createCentralAccountClient(config, (r) =>
  offline ? Promise.reject(Error('Isolated outage')) : proxy.fetch(r),
);
async function clubRequest(request) {
  const path = new URL(request.url).pathname;
  if (
    path === '/api/auth' ||
    path === '/api/auth-options' ||
    path.startsWith('/api/auth/')
  )
    return retiredAccountEntry();
  const owner = await createClubSessionManager({
    db,
    client,
    encryptionKey: key,
  });
  if (path === '/api/notes')
    return owner.decorate(
      request,
      await createBusinessNotesHandler(db, client, owner.sessions, ['niulai'])(
        request,
      ),
    );
  if (path.startsWith('/api/account/auth/') || path === '/account/callback')
    return createAuthenticationHandler(
      db,
      client,
      owner,
      key,
    )(request, path === '/account/callback');
  return owner.decorate(
    request,
    await createAccountBff(client, owner.sessions)(request),
  );
}
async function clubApi(
  who,
  path,
  body,
  status = 200,
  method = body === undefined ? 'GET' : 'POST',
) {
  const response = who.apply(
    await clubRequest(
      who.request(path, {
        body,
        method,
        headers:
          body === undefined || path === '/entitlements/check'
            ? {}
            : { 'Idempotency-Key': secret() },
      }),
    ),
  );
  const json = await response.json();
  assert.equal(response.status, status, path + ': ' + JSON.stringify(json));
  return json.data;
}
async function start() {
  host = createMolisWorkLocalHost({ homeDirectory: home, completeText: null });
  server = createDesktopWebHost({
    ptyClientFilePath: () => join(home, 'unused.js'),
  })({
    homeDirectory: home,
    localHost: host,
    controlToken: control,
    account: {
      environment: workConfig,
      fetch: (url, init) => {
        if (offline) return Promise.reject(Error('Isolated outage'));
        if (init?.body && JSON.parse(init.body).grantType === 'refresh_token')
          refreshes++;
        return proxy.fetch(new Request(url, init));
      },
    },
  });
  await new Promise((r, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', r);
  });
}
async function workApi(
  path,
  body,
  status = 200,
  method = body === undefined ? 'GET' : 'POST',
) {
  const response = await fetch(origin + '/api/account' + path, {
    method,
    headers: {
      Origin: origin,
      'x-molis-work-control-token': control,
      'Content-Type': 'application/json',
      ...(body === undefined
        ? {}
        : {
            ...(path === '/entitlements/check'
              ? {}
              : { 'Idempotency-Key': secret() }),
            'x-molis-work-idempotency-key': secret(),
          }),
      Connection: 'close',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const json = await response.json();
  assert.equal(response.status, status, path + ': ' + JSON.stringify(json));
  return json.data;
}
async function login(api, password) {
  const tx = await api('/auth/transactions', {
    purpose: 'LOGIN',
    method: 'EMAIL_PASSWORD',
  });
  await api('/auth/transactions/' + tx.handle + '/submit', {
    step: 'PASSWORD_LOGIN',
    email: 'verified@example.test',
    password,
  });
  return (
    await api('/auth/transactions/' + tx.handle + '/submit', {
      step: 'COMPLETE',
    })
  ).account;
}
const sqlStatements = (text) =>
  text
    .replace(/--[^\n]*/g, '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
const copy = new DatabaseSync(':memory:');
try {
  await initializeLocalRuntime(proxy);
  const seed = await seedSynthetic(proxy.env.DB);
  await proxy.env.DB.prepare(
    'UPDATE auth_client SET redirects=? WHERE client_id=?',
  )
    .bind(JSON.stringify(workConfig.redirectAllowlist), workConfig.clientId)
    .run();
  await proxy.env.DB.prepare(
    'UPDATE auth_client_policy SET allowed_origins=? WHERE client_id=?',
  )
    .bind(JSON.stringify([origin]), workConfig.clientId)
    .run();
  const originalTables = ['user', 'account', 'session', 'notes'];
  for (const file of readdirSync('drizzle')
    .filter((f) => f.endsWith('.sql'))
    .sort()) {
    const text = readFileSync('drizzle/' + file, 'utf8');
    copy.exec(text);
    await db.batch(sqlStatements(text).map((sql) => db.prepare(sql)));
  }
  const originalSql = [
    "INSERT INTO user(id,name,email,email_verified,created_at,updated_at) VALUES ('original','Original name','verified@example.test',0,1,2)",
    "INSERT INTO account(id,user_id,account_id,provider_id,password,created_at,updated_at) VALUES ('credential','original','original','credential','unconverted-synthetic-format',1,2)",
    "INSERT INTO session(id,user_id,token,expires_at,created_at,updated_at) VALUES ('old-session','original','synthetic-retired-cookie',9999999999999,1,2)",
    "INSERT INTO notes(id,work,name,body,user_id,created_at) VALUES ('history','niulai','Historical byline','Retained synthetic feedback','original','2020-01-01')",
  ];
  for (const sql of originalSql) {
    copy.exec(sql);
    await db.prepare(sql).run();
  }
  const snapshot = async () =>
    Promise.all(
      originalTables.map(
        async (t) =>
          (await db.prepare('SELECT * FROM ' + t + ' ORDER BY id').all())
            .results,
      ),
    );
  const before = await snapshot();
  for (const path of [
    '/api/auth',
    '/api/auth-options',
    '/api/auth/get-session',
    '/api/auth/sign-up/email',
    '/api/auth/sign-in/email',
    '/api/auth/change-password',
    '/api/auth/link-social',
    '/api/auth/callback/google',
    '/api/auth/reset-password',
    '/api/auth/sign-out',
  ]) {
    for (const method of ['GET', 'POST']) {
      const response = await clubRequest(
        new Request(config.client.productOrigin + path, {
          method,
          headers: {
            Cookie: 'better-auth.session_token=synthetic-retired-cookie',
            Origin: config.client.productOrigin,
          },
          ...(method === 'POST'
            ? {
                body: JSON.stringify({
                  email: 'verified@example.test',
                  password: seed.password,
                }),
              }
            : {}),
        }),
      );
      assert.equal(response.status, 410);
      assert.equal(response.headers.get('set-cookie'), null);
    }
  }
  assert.deepEqual(
    await snapshot(),
    before,
    'retired routes cannot change historical identities or data',
  );
  const oldBrowser = browser();
  oldBrowser.cookie = 'better-auth.session_token=synthetic-retired-cookie';
  assert.equal((await clubApi(oldBrowser, '/session')).state, 'ANONYMOUS');
  const project = await withCatalog({ homeDirectory: home }, (c) =>
    c.createProject({
      display_name: 'Preserved local project',
      actor_id: LOCAL_PERSON_ACTOR_ID,
    }),
  );
  const content = join(home, 'synthetic-content.txt');
  await writeFile(content, 'Local content stays on this device.');
  const catalogRows = () => {
    const sql = new DatabaseSync(join(home, 'projects', 'catalog.db'), {
      readOnly: true,
    });
    try {
      return sql
        .prepare('SELECT * FROM project_events ORDER BY event_id')
        .all();
    } finally {
      sql.close();
    }
  };
  const eventsBefore = catalogRows();
  assert.ok(eventsBefore.length > 0);
  assert.ok(eventsBefore.every((e) => e.actor_id === LOCAL_PERSON_ACTOR_ID));
  const priorConfig = {
    authOrigin,
    clientId: 'synthetic-old-work',
    desktopClientId: 'synthetic-old-work-desktop',
  };
  const priorRef =
    'personal-auth:' +
    createHash('sha256').update(JSON.stringify(priorConfig)).digest('hex');
  const priorState = JSON.stringify({
    identity: {
      userId: 'verified',
      displayName: 'Prior user',
      emails: [],
      applicationId: 'synthetic-products',
    },
    clientId: priorConfig.clientId,
    access: seed.accesses['synthetic-old-work'],
    refresh: seed.refreshes['synthetic-old-work'],
    expires: Date.now() + 600_000,
  });
  createLazyFileSecretStore(home).put(priorRef, priorState);
  await mkdir(join(home, 'config'), { recursive: true });
  const native = secret();
  await writeFile(join(home, 'config/native-session-token'), native, {
    mode: 0o600,
  });
  const preserved = async () => {
    assert.deepEqual(
      await host.configurePersonalPlanning(home, withCatalog)(
        { homeDirectory: home },
        (c) => c.getProject(project.project_id),
      ),
      project,
    );
    assert.deepEqual(catalogRows(), eventsBefore);
    assert.equal(
      await readFile(content, 'utf8'),
      'Local content stays on this device.',
    );
    assert.equal(createLazyFileSecretStore(home).get(priorRef), priorState);
    assert.equal(
      await readFile(join(home, 'config/native-session-token'), 'utf8'),
      native,
    );
  };
  await start();
  assert.equal((await workApi('/session')).state, 'ANONYMOUS');
  assert.equal(
    (
      await fetch(origin + '/api/account/session', {
        headers: {
          Origin: origin,
          Cookie: 'molis-work-session=' + secret(),
          'x-molis-work-native-session': native,
        },
      })
    ).status,
    403,
  );
  const plan = {
    formatVersion: 1,
    environment: 'SYNTHETIC_ONLY',
    runId: crypto.randomUUID(),
    inventoryDigest: (await inventory(proxy.env.DB, 'AUTH')).sourceDigest,
    targets,
    review: {
      reviewedBy: 'synthetic-reviewer',
      evidenceReference: 'work-club09-fixture',
    },
  };
  await applyRehearsal(proxy.env.DB, plan);
  const decision = {
    formatVersion: 1,
    mode: 'LINK',
    issuer: authOrigin,
    authUserId: 'verified',
    localUserId: 'original',
    status: 'VERIFIED',
    evidence: 'VERIFIED_EXISTING_LINK',
    evidenceReference: 'synthetic-existing-link',
    reviewedBy: 'synthetic-reviewer',
    reviewedAt: new Date().toISOString(),
    sourceDigest: inventoryBusinessIdentities(copy).users[0].sourceDigest,
    displayName: null,
  };
  applyBusinessIdentityDecision(copy, decision);
  const mapping = copy
    .prepare('SELECT * FROM central_business_identities')
    .get();
  await db
    .prepare(
      'INSERT INTO central_business_identities(' +
        Object.keys(mapping).join(',') +
        ') VALUES (' +
        Object.keys(mapping)
          .map(() => '?')
          .join(',') +
        ')',
    )
    .bind(...Object.values(mapping))
    .run();
  const b = browser(),
    club = (path, body, status, method) =>
      clubApi(b, path, body, status, method);
  await club('/session');
  const first = await login(workApi, seed.password),
    other = await login(club, seed.password);
  assert.equal(first.user.userId, 'verified');
  assert.equal(other.user.userId, first.user.userId);
  await workApi(
    '/profile',
    { displayName: 'Shared profile', expectedVersion: first.user.version },
    200,
    'PATCH',
  );
  assert.equal((await club('/session')).user.displayName, 'Shared profile');
  await exerciseCrossProductManagement({
    authDb: proxy.env.DB,
    clubDb: db,
    client,
    key,
    browser: b,
    workApi,
    club,
    userId: first.user.userId,
    preserved,
  });
  await host.close();
  await start();
  const restored = await workApi('/session');
  assert.equal(restored.session.loginSessionId, first.session.loginSessionId);
  assert.equal(restored.session.lastActiveAt, first.session.lastActiveAt);
  await proxy.env.DB.prepare(
    'UPDATE auth_login_access_token SET expires_at=? WHERE login_session_id=?',
  )
    .bind(Date.now() - 1, first.session.loginSessionId)
    .run();
  assert.equal((await workApi('/session')).state, 'AUTHENTICATED');
  assert.equal(refreshes, 1);
  await host.close();
  await start();
  assert.equal(
    (await workApi('/session')).session.loginSessionId,
    first.session.loginSessionId,
  );
  await preserved();
  const note = {
    id: crypto.randomUUID(),
    work: 'niulai',
    body: 'Post-cutover feedback',
  };
  const post = () =>
    clubRequest(
      new Request(config.client.productOrigin + '/api/notes', {
        method: 'POST',
        headers: {
          Cookie: b.cookie,
          Origin: config.client.productOrigin,
          'X-CSRF-Token': b.csrf,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      }),
    );
  assert.equal((await post()).status, 201);
  assert.equal(
    (
      await db
        .prepare('SELECT user_id FROM notes WHERE id=?')
        .bind(note.id)
        .first()
    ).user_id,
    'original',
  );
  offline = true;
  assert.equal((await workApi('/session')).state, 'OFFLINE_CACHED');
  assert.equal(
    (
      await fetch(origin + '/projects/' + project.project_id + '/', {
        headers: {
          'x-molis-work-control-token': control,
          Origin: origin,
          Connection: 'close',
        },
      })
    ).status,
    200,
  );
  await preserved();
  offline = false;
  await workApi('/logout', { scope: 'CURRENT_LOGIN' });
  assert.equal((await club('/session')).state, 'AUTHENTICATED');
  const pending = await workApi('/auth/transactions', {
    purpose: 'LOGIN',
    method: 'EMAIL_PASSWORD',
  });
  await host.close();
  await start();
  assert.equal((await workApi('/session')).state, 'ANONYMOUS');
  await workApi(
    '/auth/transactions/' + pending.handle + '/submit',
    {
      step: 'PASSWORD_LOGIN',
      email: 'verified@example.test',
      password: seed.password,
    },
    404,
  );
  assert.equal(
    (await fetch(origin + '/account/callback?code=old&state=old')).status,
    403,
  );
  await login(workApi, seed.password);
  await club('/logout', { scope: 'ALL_MOLIS_PRODUCTS' });
  assert.equal((await workApi('/session')).state, 'EXPIRED');
  await login(workApi, seed.password);
  await login(club, seed.password);
  // WORK09-03: switching to a different central account never switches local content or actor.
  await workApi('/logout', { scope: 'CURRENT_LOGIN' });
  const phone = '+8613800000909';
  const phoneTx = await workApi('/auth/transactions', {
    purpose: 'LOGIN',
    method: 'PHONE_OTP',
  });
  const phoneStep = (body) =>
    workApi('/auth/transactions/' + phoneTx.handle + '/submit', body);
  const challenge = await phoneStep({
    step: 'REQUEST_CHALLENGE',
    address: phone,
  });
  const delivered = await proxy.env.DB.prepare(
    'SELECT m.credential FROM auth_mock_delivery m JOIN auth_verification_challenge c ON c.delivery_id=m.delivery_id WHERE c.canonical_target=? ORDER BY c.created_at DESC LIMIT 1',
  )
    .bind(phone)
    .first();
  await phoneStep({
    step: 'VERIFY_CHALLENGE',
    challengeHandle: challenge.challengeHandle,
    credential: delivered.credential,
  });
  await phoneStep({ step: 'PHONE_LOGIN' });
  const switched = (await phoneStep({ step: 'COMPLETE' })).account;
  assert.notEqual(switched.user.userId, first.user.userId);
  assert.equal((await club('/session')).user.userId, first.user.userId);
  await host.close();
  await start();
  assert.equal((await workApi('/session')).user.userId, switched.user.userId);
  await preserved();
  // WORK09-03: Club invites the newly signed-in Work user; leaving changes central
  // membership only. Existing project, local author and content remain byte-for-byte.
  await proxy.env.DB.prepare(
    "INSERT OR IGNORE INTO auth_platform_permission(user_id,permission,status,granted_by,granted_at) VALUES (?,'TENANT_CREATE','ACTIVE',?,?)",
  )
    .bind(first.user.userId, first.user.userId, Date.now())
    .run();
  const tenant = await club('/platform/tenants', {
    name: 'Synthetic cross-product tenant',
    ownerUserId: first.user.userId,
    reason: 'WORK09 isolated membership fixture',
  });
  const root = '/tenants/' + tenant.tenantId;
  const invitation = await club(root + '/invitations', {
    target: { kind: 'USER', value: switched.user.userId },
  });
  const joined = await workApi(
    '/invitations/' + invitation.invitationId + '/accept',
    {
      expectedVersion: invitation.version,
    },
  );
  assert.equal((await workApi('/tenants')).items.length, 1);
  await preserved();
  await workApi(root + '/leave', {
    expectedVersion: joined.membership.version,
  });
  assert.equal((await workApi('/tenants')).items.length, 0);
  assert.equal((await club(root + '/members')).items.length, 1);
  await preserved();
  const writesBeforeRollback = await snapshot();
  await rollbackRehearsal(proxy.env.DB, plan);
  await workApi('/session', undefined, 403);
  assert.equal((await club('/session')).state, 'EXPIRED');
  assert.ok(
    await proxy.env.DB.prepare('SELECT id FROM auth_user WHERE id=?')
      .bind(switched.user.userId)
      .first(),
  );
  assert.deepEqual(await snapshot(), writesBeforeRollback);
  await preserved();
  assert.equal(
    (await db.prepare("SELECT name FROM notes WHERE id='history'").first())
      .name,
    'Historical byline',
  );
  assert.deepEqual(
    (await db.prepare('PRAGMA foreign_key_check').all()).results,
    [],
  );
  // This root belongs to the same account; ordinary cutover/rollback did not revoke it.
  assert.equal(
    (
      await proxy.fetch(
        new Request(authOrigin + '/api/v1/users/me', {
          headers: {
            Authorization: 'Bearer ' + seed.accesses['synthetic-other-product'],
          },
        }),
      )
    ).status,
    200,
  );
  process.stdout.write(
    'PASS WORK09/CLUB09: retired endpoints, prior credential isolation, one Auth identity/profile, encrypted Host restart/refresh, offline Home preservation, stale callback refusal, current/global logout, reviewed historic author mapping and non-destructive rollback\n',
  );
} finally {
  server?.closeAllConnections();
  await host?.close();
  copy.close();
  await clubProxy.dispose();
  await proxy.dispose();
  await rm(home, { recursive: true, force: true });
}
