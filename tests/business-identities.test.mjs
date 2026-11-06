import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Worker } from 'node:worker_threads';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import {
  inventoryBusinessIdentities,
  applyBusinessIdentityDecision,
} from '../lib/account/business-migration.mjs';
import { createBusinessNotesHandler } from '../lib/account/business-notes.ts';
import { harness, login } from './fixtures/account-sessions.mjs';
const dir = new URL('../drizzle/', import.meta.url);
const migration = readFileSync(new URL('0006_light_prism.sql', dir), 'utf8');
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.sql'))
  .sort();
function seed(db, skipSessions = false) {
  for (const file of files.filter(
    (f) => !f.startsWith('0006') && !(skipSessions && f.startsWith('0004')),
  ))
    db.exec(readFileSync(new URL(file, dir), 'utf8'));
  db.exec(`INSERT INTO user(id,name,email,email_verified,created_at,updated_at) VALUES ('historic','Historic name','old@example.test',0,1,2),('verified','Verified','verified@example.test',1,3,4);
    INSERT INTO account(id,user_id,account_id,provider_id,password,created_at,updated_at) VALUES ('credential','historic','historic','credential','retained-test-password-format',1,2);
    INSERT INTO account(id,user_id,account_id,provider_id,access_token,created_at,updated_at) VALUES ('github','historic','stable-provider-subject','github','retained-test-provider-value',1,2);
    INSERT INTO session(id,user_id,token,expires_at,created_at,updated_at) VALUES ('old-session','historic','retained-test-session-value',99,1,2);
    INSERT INTO notes(id,work,name,body,user_id,created_at) VALUES ('old-note','niulai','Unchanged author','Unchanged history','historic','2020-01-01'),('anonymous-note','niulai','Visitor','Anonymous history',NULL,'2020-01-02');`);
}
const preserved = (db) =>
  Object.fromEntries(
    ['user', 'account', 'session', 'notes', 'applications', 'verification'].map(
      (t) => [t, db.prepare('SELECT * FROM ' + t + ' ORDER BY id').all()],
    ),
  );
function decision(db, authUserId = 'central-user', localUserId = 'historic') {
  return {
    formatVersion: 1,
    mode: 'LINK',
    issuer: 'http://127.0.0.1:8787',
    authUserId,
    localUserId,
    status: 'VERIFIED',
    evidence: 'REVIEWED_OWNER_PROOF',
    evidenceReference: 'review-08',
    reviewedBy: 'isolated-reviewer',
    reviewedAt: new Date().toISOString(),
    sourceDigest: inventoryBusinessIdentities(db).users.find(
      (u) => u.localUserId === localUserId,
    ).sourceDigest,
    displayName: null,
  };
}
function fixture(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec('PRAGMA foreign_keys=ON');
  seed(db);
  db.exec('BEGIN;' + migration + 'COMMIT;');
  return db;
}
void test('CLUB08-01: D1-compatible migration retains every historic value, foreign keys and nullable email', (t) => {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec('PRAGMA foreign_keys=ON');
  seed(db);
  const before = preserved(db),
    inventoryBefore = inventoryBusinessIdentities(db);
  db.exec('BEGIN;' + migration + 'COMMIT;');
  assert.deepEqual(preserved(db), before);
  assert.deepEqual(inventoryBusinessIdentities(db), inventoryBefore);
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
  assert.equal(
    db
      .prepare(
        "SELECT [notnull] FROM pragma_table_info('user') WHERE name='email'",
      )
      .get().notnull,
    0,
  );
  assert.equal(db.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
  const report = inventoryBusinessIdentities(db),
    printed = JSON.stringify(report);
  assert.equal(
    report.users.find((u) => u.localUserId === 'historic').emailVerified,
    false,
  );
  assert.equal(
    report.users.find((u) => u.localUserId === 'verified').emailVerified,
    true,
  );
  assert.doesNotMatch(
    printed,
    /old@example|retained-test|stable-provider-subject|Unchanged history/,
  );
});
void test('CLUB08-01: unexpected references stop migration and the surrounding transaction rolls back', (t) => {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  seed(db);
  db.exec(
    "CREATE TABLE future_child(id TEXT REFERENCES user(id) ON DELETE CASCADE);INSERT INTO future_child VALUES ('historic')",
  );
  const before = preserved(db);
  db.exec('BEGIN');
  assert.throws(() => db.exec(migration), /CHECK/);
  db.exec('ROLLBACK');
  assert.deepEqual(preserved(db), before);
  assert.equal(db.prepare('SELECT count(*) n FROM future_child').get().n, 1);
});
void test('CLUB08-02: explicit evidence, stale review refusal, both unique directions and idempotent retry', async (t) => {
  const db = fixture(t),
    before = preserved(db),
    d = decision(db);
  for (const patch of [
    { status: 'PENDING' },
    { status: 'CONFLICT' },
    { evidence: 'EMAIL_MATCH' },
    { sourceDigest: 'a'.repeat(64) },
    { reviewedBy: '' },
  ])
    assert.throws(() => applyBusinessIdentityDecision(db, { ...d, ...patch }));
  assert.equal(applyBusinessIdentityDecision(db, d).status, 'APPLIED');
  assert.equal(applyBusinessIdentityDecision(db, d).status, 'ALREADY_APPLIED');
  const concurrent = await Promise.allSettled(
    ['contender-one', 'contender-two'].map(async (authUserId) =>
      applyBusinessIdentityDecision(db, {
        ...decision(db, authUserId, 'verified'),
      }),
    ),
  );
  assert.equal(concurrent.filter((r) => r.status === 'fulfilled').length, 1);
  assert.throws(
    () =>
      applyBusinessIdentityDecision(
        db,
        decision(db, 'central-user', 'verified'),
      ),
    /conflict/,
  );
  assert.throws(
    () =>
      db
        .prepare(
          'INSERT INTO central_business_identities SELECT local_user_id,issuer,?,evidence,evidence_reference,reviewed_by,reviewed_at,source_digest,decision_digest,created_at FROM central_business_identities WHERE local_user_id=?',
        )
        .run('unreviewed', 'historic'),
    /UNIQUE/,
  );
  assert.deepEqual(preserved(db), before);
  assert.equal(
    db.prepare('SELECT count(*) n FROM central_business_identities').get().n,
    2,
  );
});
void test('CLUB08-02: reviewed new phone identities use NULL email, do not overwrite old users, and rollback on failure', (t) => {
  const db = fixture(t),
    before = preserved(db),
    d = {
      ...decision(db),
      mode: 'NEW',
      localUserId: 'new-phone',
      authUserId: 'central-phone',
      evidence: 'REVIEWED_NEW_IDENTITY',
      displayName: 'Phone user',
      sourceDigest: inventoryBusinessIdentities(db).inventoryDigest,
    };
  db.exec(
    "CREATE TRIGGER simulate_mapping_failure BEFORE INSERT ON central_business_identities BEGIN SELECT RAISE(ABORT,'injected failure');END",
  );
  assert.throws(() => applyBusinessIdentityDecision(db, d), /injected failure/);
  assert.deepEqual(preserved(db), before);
  db.exec('DROP TRIGGER simulate_mapping_failure');
  applyBusinessIdentityDecision(db, d);
  assert.equal(
    db.prepare("SELECT email FROM user WHERE id='new-phone'").get().email,
    null,
  );
  assert.deepEqual(preserved(db).notes, before.notes);
  assert.equal(
    inventoryBusinessIdentities(db).users.find(
      (u) => u.localUserId === 'historic',
    ).state,
    'REVIEW_REQUIRED',
  );
});
void test('CLUB08-03: central session + CSRF + reviewed mapping write to original local ID; no old-cookie or offline fallback', async (t) => {
  const h = await harness(t),
    db = h.db;
  seed(db.sql, true);
  db.sql.exec(migration);
  const { browser: b, tokens } = await login(h);
  const originalPrepare = db.prepare.bind(db);
  db.prepare = (query) => {
    const p = originalPrepare(query);
    return {
      bind(...values) {
        return p.bind(...values);
      },
    };
  };
  const handler = createBusinessNotesHandler(db, h.client, h.owner.sessions, [
    'niulai',
  ]);
  const request = (patch = {}) =>
    new Request('http://127.0.0.1:3000/api/notes', {
      method: 'POST',
      headers: {
        cookie: b.cookie,
        origin: 'http://127.0.0.1:3000',
        'x-csrf-token': b.csrf,
        'content-type': 'application/json',
        ...patch,
      },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        work: 'niulai',
        body: 'A new note from central account',
        userId: 'verified',
        name: 'Forged name',
      }),
    });
  assert.equal((await handler(request())).status, 409);
  assert.equal(db.sql.prepare('SELECT count(*) n FROM user').get().n, 2);
  applyBusinessIdentityDecision(
    db.sql,
    decision(db.sql, tokens.session.userId ?? 'same-user'),
  );
  assert.equal(
    (await handler(request({ 'x-csrf-token': 'wrong' }))).status,
    403,
  );
  assert.equal(
    (
      await handler(
        request({ cookie: 'better-auth.session_token=old-session' }),
      )
    ).status,
    401,
  );
  assert.equal(
    (await handler(request({ origin: 'https://foreign.example' }))).status,
    403,
  );
  assert.equal((await handler(request())).status, 201);
  const note = db.sql
    .prepare(
      "SELECT * FROM notes WHERE id NOT IN ('old-note','anonymous-note')",
    )
    .get();
  assert.equal(note.user_id, 'historic');
  assert.equal(note.name, 'Session User');
  assert.equal(
    db.sql.prepare("SELECT name FROM notes WHERE id='old-note'").get().name,
    'Unchanged author',
  );
  h.auth.offline = true;
  assert.equal((await handler(request())).status, 503);
  h.auth.offline = false;
  h.auth.sessions.get(tokens.session.loginSessionId).revoked = true;
  assert.equal((await handler(request())).status, 401);
  assert.equal(db.sql.prepare('SELECT count(*) n FROM notes').get().n, 3);
});

void test('CLUB08-02: independent concurrent writers cannot attach two central identities to one historic user', async (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'club08-race-')),
    path = join(dir, 'copy.sqlite');
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const db = new DatabaseSync(path);
  seed(db);
  db.exec('BEGIN;' + migration + 'COMMIT;');
  const first = decision(db, 'contender-one'),
    second = { ...first, authUserId: 'contender-two' };
  db.close();
  const start = new SharedArrayBuffer(4),
    gate = new Int32Array(start),
    migrationModule = new URL(
      '../lib/account/business-migration.mjs',
      import.meta.url,
    ).href;
  const workers = [first, second].map(
    (d) =>
      new Worker(
        `
    const {parentPort,workerData}=require('node:worker_threads');
    (async()=>{const {DatabaseSync}=require('node:sqlite');const {applyBusinessIdentityDecision}=await import(workerData.migrationModule);
    const db=new DatabaseSync(workerData.path);db.exec('PRAGMA foreign_keys=ON;PRAGMA busy_timeout=5000');parentPort.postMessage('ready');
    Atomics.wait(new Int32Array(workerData.start),0,0);try{parentPort.postMessage(applyBusinessIdentityDecision(db,workerData.d).status);}catch(e){parentPort.postMessage(e.message);}finally{db.close();}})().catch(e=>{throw e;});
  `,
        { eval: true, workerData: { d, path, migrationModule, start } },
      ),
  );
  const results = workers.map(
    (w) =>
      new Promise((resolve, reject) => {
        w.on('error', reject);
        w.on('message', (m) => {
          if (m !== 'ready') resolve(m);
        });
      }),
  );
  await Promise.all(
    workers.map(
      (w) =>
        new Promise((resolve, reject) => {
          w.once('error', reject);
          w.once('message', resolve);
        }),
    ),
  );
  Atomics.store(gate, 0, 1);
  Atomics.notify(gate, 0, 2);
  assert.deepEqual(
    (await Promise.all(results)).sort((a, b) => a.localeCompare(b)),
    ['APPLIED', 'Identity mapping conflict'],
  );
  await Promise.all(workers.map((w) => w.terminate()));
  const verify = new DatabaseSync(path);
  try {
    assert.equal(
      verify.prepare('SELECT count(*) n FROM central_business_identities').get()
        .n,
      1,
    );
    assert.equal(verify.prepare('SELECT count(*) n FROM notes').get().n, 2);
  } finally {
    verify.close();
  }
});

void test('CLUB08-01: custom views, triggers or indexes require schema review before any table is rebuilt', (t) => {
  for (const extra of [
    'CREATE VIEW custom_view AS SELECT * FROM user',
    'CREATE TRIGGER custom_trigger AFTER INSERT ON user BEGIN SELECT 1; END',
    'CREATE INDEX custom_index ON notes(name)',
  ]) {
    const db = new DatabaseSync(':memory:');
    t.after(() => db.close());
    seed(db);
    db.exec(extra);
    const before = preserved(db);
    db.exec('BEGIN');
    assert.throws(() => db.exec(migration), /CHECK/);
    db.exec('ROLLBACK');
    assert.deepEqual(preserved(db), before);
  }
});
