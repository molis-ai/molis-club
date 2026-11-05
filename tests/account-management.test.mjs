import test from 'node:test';
import assert from 'node:assert/strict';
import { harness, login, browser } from './fixtures/account-sessions.mjs';

void test('CLUB-04: sensitive proofs bind the original browser and login across Worker instances and token refresh', async (t) => {
  const h = await harness(t),
    first = await login(h),
    second = await login(h);
  const original = (
    await h.owner.authenticationBinding(first.browser.request())
  ).identity;
  const worker = await h.make();
  assert.deepEqual(
    (await worker.authenticationBinding(first.browser.request(), original))
      .identity,
    original,
  );
  await assert.rejects(
    worker.authenticationBinding(second.browser.request(), original),
    (e) => e.status === 403,
  );
  await assert.rejects(
    worker.authenticationBinding(
      first.browser.request('/reauthentications', {
        headers: { 'X-CSRF-Token': '' },
      }),
      original,
    ),
    (e) => e.status === 403,
  );
  await assert.rejects(
    worker.authenticationBinding(browser().request(), original),
    (e) => e.status === 401,
  );
  const family = h.auth.sessions.get(first.tokens.session.loginSessionId);
  family.accessRejected = true;
  assert.deepEqual(
    (
      await (
        await h.make()
      ).authenticationBinding(first.browser.request(), original)
    ).identity,
    original,
  );
  assert.equal(h.auth.counts.refresh, 1);
  await first.browser.call(worker, h.client, '/logout', {
    method: 'POST',
    body: { scope: 'CURRENT_LOGIN' },
    headers: { 'Idempotency-Key': crypto.randomUUID() },
  });
  await assert.rejects(
    (await h.make()).authenticationBinding(first.browser.request(), original),
    (e) => e.status === 401,
  );
  assert.equal(
    (await second.browser.call(await h.make(), h.client, '/session')).status,
    200,
  );
});
