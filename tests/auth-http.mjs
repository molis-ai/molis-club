// Run against the local D1-backed development server: node tests/auth-http.mjs.
// These accounts exist only in the local preview database; no production writes.
import assert from 'node:assert/strict';
const base = 'http://localhost:3000';
const password = 'local-test-' + crypto.randomUUID(),
  nextPassword = 'next-test-' + crypto.randomUUID();
const email = `studio-${Date.now()}@example.test`;
let cookie = '';
async function call(path, body, withCookie = true, origin = base) {
  const r = await fetch(base + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      'content-type': 'application/json',
      origin,
      ...(withCookie && cookie ? { cookie } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const raw = await r.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    data = { error: raw.slice(0, 200) };
  }
  return { status: r.status, data, headers: r.headers };
}
function adopt(r) {
  const cookies = r.headers
    .getSetCookie()
    .filter((v) => v.includes('session_token='));
  if (cookies.length) cookie = cookies.map((v) => v.split(';')[0]).join('; ');
}
const options = await call('/api/auth-options');
assert.deepEqual(options.data, { google: false, github: false });
assert.equal(
  (
    await call(
      '/api/notes',
      {
        id: crypto.randomUUID(),
        work: 'niulai',
        name: 'fake',
        body: '一条匿名反馈不该保存。',
      },
      false,
    )
  ).status,
  401,
);
let r = await call('/api/auth/sign-up/email', {
  name: '本地认证测试',
  email,
  password,
});
assert.equal(r.status, 200, JSON.stringify(r.data));
adopt(r);
assert.ok(cookie);
assert.match(r.headers.get('set-cookie'), /HttpOnly/i);
assert.match(r.headers.get('set-cookie'), /SameSite=Lax/i);
const initialCookie = cookie;
assert.equal((await call('/api/auth/get-session')).data.user.email, email);
r = await call(
  '/api/auth/sign-up/email',
  { name: 'duplicate', email, password },
  false,
);
assert.ok(r.status >= 400);
r = await call(
  '/api/auth/sign-in/email',
  { email, password: 'wrong-password-123' },
  false,
);
assert.ok(r.status >= 400);
const note = {
  id: crypto.randomUUID(),
  work: 'niulai',
  name: '冒充名字',
  body: '这是本地认证集成测试的反馈。',
};
r = await call('/api/notes', note);
assert.equal(r.status, 201, JSON.stringify(r.data));
assert.equal(r.data.note.name, '本地认证测试');
assert.equal(r.data.note.registered, 1);
assert.equal((await call('/api/notes', note)).status, 201);
assert.equal(
  (await call('/api/notes?work=niulai')).data.notes.filter(
    (n) => n.id === note.id,
  ).length,
  1,
);
// A hostile origin must be rejected and nothing stored. The notes API answers 400
// (its origin check shares the bad-payload path); vinext dev blocks cross-origin
// requests before the app with 403. Either is a rejection.
const hostile = { ...note, id: crypto.randomUUID() };
r = await call('/api/notes', hostile, true, 'https://evil.example');
assert.ok([400, 403].includes(r.status), `hostile origin got ${r.status}`);
assert.equal(
  (await call('/api/notes?work=niulai')).data.notes.filter(
    (n) => n.id === hostile.id,
  ).length,
  0,
);
r = await call('/api/auth/sign-in/email', { email, password }, false);
assert.equal(r.status, 200, JSON.stringify(r.data));
adopt(r);
const otherCookie = cookie;
assert.notEqual(otherCookie, initialCookie);
cookie = initialCookie;
r = await call('/api/auth/change-password', {
  currentPassword: password,
  newPassword: nextPassword,
  revokeOtherSessions: true,
});
assert.equal(r.status, 200, JSON.stringify(r.data));
adopt(r);
const updatedCookie = cookie;
cookie = otherCookie;
assert.equal((await call('/api/auth/get-session')).data, null);
cookie = updatedCookie;
assert.equal((await call('/api/auth/get-session')).data.user.email, email);
r = await call('/api/auth/sign-out', {});
assert.equal(r.status, 200);
assert.equal((await call('/api/auth/get-session')).data, null);
assert.equal(
  (await call('/api/notes', { ...note, id: crypto.randomUUID() })).status,
  401,
);
r = await call(
  '/api/auth/sign-in/email',
  { email, password: nextPassword },
  false,
);
assert.equal(r.status, 200, JSON.stringify(r.data));
adopt(r);
assert.equal((await call('/api/auth/get-session')).data.user.email, email);
await call('/api/auth/sign-out', {});
console.log(
  'PASS: D1-backed signup, duplicate/wrong password rejection, HttpOnly session, authenticated author, retry persistence, hostile origin, password change + other-session revocation, logout + re-login.',
);
