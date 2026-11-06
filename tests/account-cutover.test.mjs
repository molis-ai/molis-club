import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Exercise the actual route exports; there must be no Cloudflare env, DB or Better Auth import.
void test('CLUB09-01: all retired route methods reject without reading request credentials, environment or database', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'club09-routes-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const [index, route] of [
    'app/api/auth/route.ts',
    'app/api/auth/[...all]/route.ts',
    'app/api/auth-options/route.ts',
  ].entries()) {
    const bundled = await build({
      entryPoints: [route],
      bundle: true,
      write: false,
      platform: 'node',
      format: 'esm',
      metafile: true,
    });
    assert.ok(
      Object.keys(bundled.metafile.inputs).every(
        (p) => !p.includes('node_modules') && !p.endsWith('lib/auth.ts'),
      ),
    );
    const file = join(directory, index + '.mjs');
    await writeFile(file, bundled.outputFiles[0].contents);
    const exports = await import(pathToFileURL(file).href);
    assert.deepEqual(
      Object.keys(exports).sort(),
      index === 2
        ? ['GET']
        : ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
    );
    const request = new Proxy(
      {},
      {
        get() {
          assert.fail('Retired entry must not inspect credentials');
        },
      },
    );
    for (const handler of Object.values(exports)) {
      const response = handler(request);
      assert.equal(response.status, 410);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(response.headers.get('set-cookie'), null);
      assert.equal(response.headers.get('location'), null);
      assert.deepEqual(await response.json(), {
        error: { code: 'AUTH_ENTRY_RETIRED', message: '请使用统一账号登录。' },
        loginPath: '/login',
      });
    }
  }
});
