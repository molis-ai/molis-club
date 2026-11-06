// CLUB08-01 CLUB08-02 CLUB08-03: actual Rust Auth, workerd D1 migrations and Club business BFF.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readdirSync } from 'node:fs';
import {
  inventoryBusinessIdentities,
  applyBusinessIdentityDecision,
} from '../lib/account/business-migration.mjs';
import { createBusinessNotesHandler } from '../lib/account/business-notes.ts';
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
let offline = false;
const clubProxy = await getRustProxy({ AUTH_ORIGIN: config.client.authOrigin });
const db = clubProxy.env.DB,
  key = randomBytes(32).toString('base64url'),
  client = createCentralAccountClient(config, (request) =>
    offline ? Promise.reject(Error('Isolated outage')) : proxy.fetch(request),
  );
async function raw(request) {
  const owner = await createClubSessionManager({
    db,
    client,
    encryptionKey: key,
  });
  if (new URL(request.url).pathname === '/api/notes')
    return owner.decorate(
      request,
      await createBusinessNotesHandler(db, client, owner.sessions, ['niulai'])(
        request,
      ),
    );
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
  const delivery = await proxy.env.DB.prepare(
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
const copy = new DatabaseSync(':memory:');
const statements = (text) =>
  text
    .replace(/--[^\n]*/g, '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
try {
  await initializeLocalRuntime(proxy);
  for (const sql of statements(
    readFileSync(
      resolve(source, 'worker/unified-account-local-seed.sql'),
      'utf8',
    ),
  ))
    await proxy.env.DB.prepare(sql).run();
  for (const file of readdirSync('drizzle')
    .filter((f) => f.endsWith('.sql') && !f.startsWith('0006'))
    .sort()) {
    const sql = readFileSync('drizzle/' + file, 'utf8');
    copy.exec(sql);
    for (const text of statements(sql)) await db.prepare(text).run();
  }
  const oldUser =
      "INSERT INTO user(id,name,email,email_verified,created_at,updated_at) VALUES ('original','Historical author','kept@example.test',0,1,2)",
    oldNote =
      "INSERT INTO notes(id,work,name,body,user_id,created_at) VALUES ('history','niulai','Original byline','Historical feedback','original','2020-01-01')",
    oldAccount =
      "INSERT INTO account(id,user_id,account_id,provider_id,password,created_at,updated_at) VALUES ('credential','original','original','credential','retained-fixture',1,2)",
    oldSession =
      "INSERT INTO session(id,user_id,token,expires_at,created_at,updated_at) VALUES ('session','original','retained-fixture-session',9,1,2)";
  for (const sql of [oldUser, oldNote, oldAccount, oldSession]) {
    copy.exec(sql);
    await db.prepare(sql).run();
  }
  const migrate = readFileSync('drizzle/0006_light_prism.sql', 'utf8');
  copy.exec('BEGIN;' + migrate + 'COMMIT;');
  await db.batch(statements(migrate).map((sql) => db.prepare(sql)));
  for (const table of ['user', 'account', 'session', 'notes'])
    assert.deepEqual(
      (
        await db.prepare('SELECT * FROM ' + table + ' ORDER BY id').all()
      ).results.map((v) => ({ ...v })),
      copy
        .prepare('SELECT * FROM ' + table + ' ORDER BY id')
        .all()
        .map((v) => ({ ...v })),
    );
  assert.deepEqual(
    (await db.prepare('PRAGMA foreign_key_check').all()).results,
    [],
  );
  const user = await login('+8613800000801');
  const note = {
    id: crypto.randomUUID(),
    work: 'niulai',
    body: 'Feedback using the central account',
    userId: 'forged-local-id',
    name: 'Forged author',
  };
  const post = async (headers = {}) =>
    user.b.apply(
      await raw(
        new Request(config.client.productOrigin + '/api/notes', {
          method: 'POST',
          headers: {
            cookie: user.b.cookie,
            origin: config.client.productOrigin,
            'x-csrf-token': user.b.csrf,
            'content-type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(note),
        }),
      ),
    );
  assert.equal((await post()).status, 409);
  const decision = {
    formatVersion: 1,
    mode: 'LINK',
    issuer: config.client.authOrigin,
    authUserId: user.id,
    localUserId: 'original',
    status: 'VERIFIED',
    evidence: 'REVIEWED_OWNER_PROOF',
    evidenceReference: 'synthetic-08',
    reviewedBy: 'test-reviewer',
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
  assert.equal((await post({ 'x-csrf-token': 'wrong' })).status, 403);
  assert.equal(
    (
      await post({
        cookie: 'better-auth.session_token=retained-fixture-session',
      })
    ).status,
    401,
  );
  assert.equal((await post()).status, 201);
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
  assert.equal(
    (await db.prepare("SELECT name FROM notes WHERE id='history'").first())
      .name,
    'Original byline',
  );
  offline = true;
  assert.equal((await post()).status, 503);
  offline = false;
  await api(user.b, '/logout', { scope: 'CURRENT_LOGIN' });
  assert.equal((await post()).status, 401);
  assert.equal((await db.prepare('SELECT count(*) n FROM notes').first()).n, 2);
  process.stdout.write(
    'PASS CLUB-08: actual Auth + workerd/D1, lossless FK migration, reviewed identity mapping, original notes identity, retry, CSRF/old cookie/offline/revocation refusal\n',
  );
} finally {
  copy.close();
  await clubProxy.dispose();
  await proxy.dispose();
}
