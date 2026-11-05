import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createCentralAccountClient } from '../lib/account/client.ts';
import { createClubSessionManager } from '../lib/account/sessions.ts';
import { createAuthenticationHandler } from '../lib/account/auth-http.ts';
import {
  database,
  browser,
  configuration,
  deferred,
} from './fixtures/account-sessions.mjs';
import { randomSessionSecret } from '../lib/account/session-crypto.ts';

async function harness(t) {
  const db = database(t);
  db.sql.exec(
    readFileSync(
      new URL(
        '../drizzle/0005_central_account_transactions.sql',
        import.meta.url,
      ),
      'utf8',
    ),
  );
  const key = randomSessionSecret(),
    pending = new Map();
  let passwordCalls = 0,
    barrier = null;
  const client = createCentralAccountClient(
    configuration(),
    async (request) => {
      const path = new URL(request.url).pathname,
        body = request.method === 'GET' ? null : await request.json();
      const response = (data) =>
        Response.json({ data, requestId: crypto.randomUUID() });
      if (path === '/api/v2/auth/transactions') {
        const id = crypto.randomUUID();
        pending.set(id, body);
        return response({
          transactionId: id,
          status: 'PENDING',
          nextStep: 'PASSWORD_LOGIN',
          expiresAt: new Date(Date.now() + 600000).toISOString(),
        });
      }
      if (path.endsWith('/password')) {
        passwordCalls++;
        if (barrier) {
          barrier.started.resolve();
          await barrier.finish.promise;
        }
        return response({ status: 'VERIFIED', nextStep: 'COMPLETE' });
      }
      if (path.endsWith('/cancel')) return response({ status: 'CANCELLED' });
      throw new Error('Unexpected Auth operation');
    },
  );
  const make = () =>
    createClubSessionManager({ db, client, encryptionKey: key });
  async function call(b, path, body, headers = {}) {
    const request = b.request(path, {
        method: body === undefined ? 'GET' : 'POST',
        body,
        headers,
      }),
      owner = await make();
    return b.apply(
      await createAuthenticationHandler(db, client, owner, key)(request),
    );
  }
  const b = browser(),
    owner = await make();
  await b.call(owner, client, '/session');
  const create = async () => {
    const r = await call(b, '/auth/transactions', {
      purpose: 'LOGIN',
      method: 'EMAIL_PASSWORD',
    });
    assert.equal(r.status, 200);
    return (await r.json()).data;
  };
  return {
    db,
    b,
    call,
    create,
    pending,
    get passwordCalls() {
      return passwordCalls;
    },
    pause() {
      barrier = { started: deferred(), finish: deferred() };
      return barrier;
    },
  };
}
void test('CLUB-03 UAS-11/28/39: browser authority and public schema reject credentials and proxy fields', async (t) => {
  const h = await harness(t);
  const body = { purpose: 'LOGIN', method: 'EMAIL_PASSWORD' };
  for (const headers of [
    { 'X-CSRF-Token': '' },
    { Origin: 'https://outside.invalid' },
    { Authorization: 'Bearer browser-input' },
    { 'Sec-Fetch-Site': 'cross-site' },
  ]) {
    const response = await h.call(h.b, '/auth/transactions', body, headers);
    assert.ok([400, 403].includes(response.status));
  }
  assert.equal(h.pending.size, 0);
  assert.equal(
    (await h.call(h.b, '/auth/transactions', { ...body, clientId: 'injected' }))
      .status,
    400,
  );
  const tx = await h.create(),
    row = h.db.sql
      .prepare('SELECT * FROM central_account_transactions WHERE id=?')
      .get(tx.handle);
  assert.equal(row.browser_digest.length, 43);
  assert.ok(row.box && !row.box.includes(h.b.cookie));
  for (const hidden of [
    'proof',
    'verifier',
    'permit',
    'transactionId',
    'accessToken',
  ])
    assert.ok(!JSON.stringify(tx).includes(hidden));
  const stranger = browser();
  assert.equal(
    (await h.call(stranger, '/auth/transactions/' + tx.handle)).status,
    409,
  );
  assert.equal(
    (
      await h.call(h.b, '/auth/transactions/' + tx.handle + '/submit', {
        step: 'PHONE_LOGIN',
      })
    ).status,
    400,
  );
  assert.equal(h.passwordCalls, 0);
  // CLUB-04: malformed binding paths are invalid input, never an upstream outage.
  for (const binding of ['%FF', '%ZZ']) {
    assert.equal(
      (
        await h.call(
          h.b,
          '/login-methods/' + binding + '/unlink',
          {
            reauthHandle: crypto.randomUUID(),
            expectedVersion: 1,
          },
          { 'Idempotency-Key': crypto.randomUUID() },
        )
      ).status,
      400,
    );
  }
});
void test('CLUB-03 UAS-11/40: cross-Worker single consumption and cancellation fence a late password response', async (t) => {
  const h = await harness(t),
    tx = await h.create(),
    barrier = h.pause(),
    path = '/auth/transactions/' + tx.handle;
  const first = h.call(h.b, path + '/submit', {
    step: 'PASSWORD_LOGIN',
    email: 'test@example.test',
    password: 'synthetic-password',
  });
  await barrier.started.promise;
  assert.equal(
    (
      await h.call(h.b, path + '/submit', {
        step: 'PASSWORD_LOGIN',
        email: 'test@example.test',
        password: 'synthetic-password',
      })
    ).status,
    409,
  );
  assert.equal((await h.call(h.b, path + '/cancel', {})).status, 200);
  barrier.finish.resolve();
  assert.equal((await first).status, 409);
  assert.equal(h.passwordCalls, 1);
  const row = h.db.sql
    .prepare('SELECT state,box FROM central_account_transactions WHERE id=?')
    .get(tx.handle);
  assert.equal(row.state, 'CANCELLED');
  assert.equal(row.box, null);
});
void test('CLUB-03 UAS-40/41: pending proof expiration, ciphertext tampering and worker interruption fail closed', async (t) => {
  const h = await harness(t);
  let tx = await h.create();
  h.db.sql
    .prepare('UPDATE central_account_transactions SET expires_at=0 WHERE id=?')
    .run(tx.handle);
  assert.equal(
    (await h.call(h.b, '/auth/transactions/' + tx.handle)).status,
    409,
  );
  tx = await h.create();
  h.db.sql
    .prepare(
      "UPDATE central_account_transactions SET box='tampered' WHERE id=?",
    )
    .run(tx.handle);
  assert.equal(
    (await h.call(h.b, '/auth/transactions/' + tx.handle)).status,
    503,
  );
  tx = await h.create();
  h.db.sql
    .prepare(
      "UPDATE central_account_transactions SET state='BUSY',lease_until=0 WHERE id=?",
    )
    .run(tx.handle);
  assert.equal(
    (
      await h.call(h.b, '/auth/transactions/' + tx.handle + '/submit', {
        step: 'PASSWORD_LOGIN',
        email: 'test@example.test',
        password: 'synthetic-password',
      })
    ).status,
    409,
  );
  assert.equal(h.passwordCalls, 0);
});
