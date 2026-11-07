// CLUB09-01/02: built Vinext routes in isolated workerd/D1, no existing config/data.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { configuration } from '../tests/fixtures/account-sessions.mjs';
import { randomSessionSecret } from '../lib/account/session-crypto.ts';
const origin = 'http://127.0.0.1:3000';
const built = JSON.parse(await readFile('dist/server/wrangler.json', 'utf8'));
const modulePaths = (await readdir('dist/server', { recursive: true })).filter(
  (path) => /\.m?js$/.test(path) && path !== built.main,
);
// Vinext emits bare chunk imports; enumerate its build outputs, entry first.
const modules = [built.main, ...modulePaths].map((path) => ({
  type: 'ESModule',
  path: resolve('dist/server', path),
}));
// Submit a complete byte body through Miniflare, avoiding Wrangler's streaming dev proxy.
const runtimeOptions = {
  modules,
  modulesRoot: resolve('dist/server'),
  compatibilityDate: built.compatibility_date,
  compatibilityFlags: built.compatibility_flags,
  assets: {
    directory: resolve('dist/server', built.assets.directory),
    routerConfig: { has_user_worker: true },
  },
  d1Databases: { DB: 'club09-synthetic' },
  d1Persist: false,
  outboundService() {
    throw Error('External fetch forbidden in route rehearsal');
  },
};
const mf = new Miniflare(convertV4MiniflareOptions(runtimeOptions));
try {
  for (const path of [
    '/api/auth',
    '/api/auth-options',
    '/api/auth/get-session',
    '/api/auth/sign-up/email',
    '/api/auth/sign-in/email',
    '/api/auth/change-password',
    '/api/auth/callback/google',
    '/api/auth/callback/github',
    '/api/auth/sign-out',
  ]) {
    for (const method of path === '/api/auth-options'
      ? ['GET']
      : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']) {
      const response = await mf.dispatchFetch(origin + path, {
        method,
        redirect: 'manual',
        headers: {
          Origin: origin,
          Cookie: 'better-auth.session_token=synthetic-retired-cookie',
          'Content-Type': 'application/json',
        },
        ...(method === 'GET'
          ? {}
          : {
              body: JSON.stringify({
                password: 'synthetic-rejected-value',
                userId: 'forged',
              }),
            }),
      });
      assert.equal(
        response.status,
        410,
        path +
          ':' +
          method +
          (response.status === 410 ? '' : ': ' + (await response.text())),
      );
      assert.equal((await response.json()).error.code, 'AUTH_ENTRY_RETIRED');
      assert.equal(response.headers.get('set-cookie'), null);
      assert.equal(response.headers.get('location'), null);
    }
  }
  for (const path of ['/login', '/account']) {
    const response = await mf.dispatchFetch(origin + path),
      html = await response.text();
    assert.equal(response.status, 200, path);
    assert.match(html, /我的账号/);
    assert.ok(html.includes('href="/account"'), 'central navigation');
    assert.ok(!html.includes('/api/auth/sign-in'), 'no old form mount');
  }
  // A missing central configuration must fail closed, never fall back to Better Auth.
  const missing = await mf.dispatchFetch(origin + '/api/account/session');
  assert.equal(missing.status, 503);
  assert.equal(
    (await missing.json()).error.code,
    'UNIFIED_CONFIGURATION_INVALID',
  );

  // A configured session request exercises Vinext's real route context argument.
  const config = configuration();
  let authCalls = 0;
  await mf.setOptions(
    convertV4MiniflareOptions({
      ...runtimeOptions,
      bindings: {
        MOLIS_CLUB_ACCOUNT_CONFIG: JSON.stringify(config),
        MOLIS_CLUB_ACCOUNT_KEY: randomSessionSecret(),
      },
      serviceBindings: {
        MOLIS_CLUB_AUTH(request) {
          authCalls++;
          assert.equal(request.method, 'POST');
          assert.equal(
            request.url,
            config.client.authOrigin + '/api/v2/auth/transactions',
          );
          assert.equal(request.headers.get('origin'), origin);
          assert.equal(request.headers.has('cookie'), false);
          if (authCalls === 2)
            return Response.redirect('https://untrusted.example.test/', 307);
          return Response.json(
            {
              requestId: crypto.randomUUID(),
              error: { code: 'INVALID_REQUEST' },
            },
            { status: 400 },
          );
        },
      },
    }),
  );
  const db = await mf.getD1Database('DB');
  const sessionSchema = await readFile(
    'drizzle/0004_central_account_sessions.sql',
    'utf8',
  );
  await db.batch(
    sessionSchema
      .split('--> statement-breakpoint')
      .map((sql) => db.prepare(sql.trim())),
  );
  const session = await mf.dispatchFetch(origin + '/api/account/session');
  const sessionBody = await session.json();
  assert.equal(session.status, 200, JSON.stringify(sessionBody));
  assert.deepEqual(sessionBody.data, { state: 'ANONYMOUS' });
  assert.ok(session.headers.has('set-cookie'));
  assert.ok(session.headers.has('x-csrf-token'));
  const startTransaction = () =>
    mf.dispatchFetch(origin + '/api/account/auth/transactions', {
      method: 'POST',
      headers: {
        Origin: origin,
        'Content-Type': 'application/json',
        Cookie: session.headers.get('set-cookie').split(';')[0],
        'X-CSRF-Token': session.headers.get('x-csrf-token'),
      },
      body: JSON.stringify({ purpose: 'LOGIN', method: 'GOOGLE' }),
    });
  const transaction = await startTransaction();
  const transactionBody = await transaction.json();
  assert.equal(authCalls, 1, JSON.stringify(transactionBody));
  assert.equal(transaction.status, 400, JSON.stringify(transactionBody));
  assert.equal(transactionBody.error.code, 'INVALID_REQUEST');
  const redirected = await startTransaction();
  assert.equal(authCalls, 2);
  assert.equal(redirected.status, 503);
  assert.equal((await redirected.json()).error.code, 'UPSTREAM_UNAVAILABLE');
  console.log(
    'PASS built Vinext: retired APIs return 410, central pages and anonymous sessions work, missing config and upstream redirects fail closed, and transactions reach the Auth binding.',
  );
} finally {
  await mf.dispose();
}
