// CLUB09-01: read-only refusal checks against an explicitly selected isolated preview.
// No signup, password change or business writes are sent by this retired-entry smoke test.
import assert from 'node:assert/strict';
const base = process.env.MOLIS_CLUB_TEST_ORIGIN;
assert.ok(base, 'Set MOLIS_CLUB_TEST_ORIGIN to an isolated local test server');
const url = new URL(base);
assert.ok(
  url.protocol === 'http:' &&
    ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname),
);
for (const path of [
  '/api/auth',
  '/api/auth-options',
  '/api/auth/get-session',
  '/api/auth/callback/google',
]) {
  const response = await fetch(new URL(path, base), {
    redirect: 'manual',
    headers: { Cookie: 'better-auth.session_token=synthetic-retired-cookie' },
  });
  assert.equal(response.status, 410, path);
  assert.equal((await response.json()).error.code, 'AUTH_ENTRY_RETIRED');
  assert.equal(response.headers.get('set-cookie'), null);
  assert.equal(response.headers.get('location'), null);
}
console.log(
  'PASS CLUB09-01: former account endpoints refuse without identity or redirects.',
);
