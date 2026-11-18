import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { clubEnvironment, validateClubBuild } from '../scripts/club-environment.mjs';
import { readClubAccountConfig } from '../lib/account/config.ts';
import { internalReturnPath } from '../lib/account/return-path.ts';
import { configuration } from './fixtures/account-sessions.mjs';

void test('ENV-05/14: TEST admits the exact Club loopback callback and rejects insecure alternatives', () => {
  const config = configuration();
  const testConfig = {
    ...config,
    client: {
      ...config.client,
      environmentKind: 'TEST',
      authOrigin: 'https://auth.test.molis.ai',
    },
  };
  assert.ok(readClubAccountConfig(JSON.stringify(testConfig)));
  for (const origin of ['http://localhost:3000', 'http://127.0.0.1:3001', 'http://test.molis.ai']) {
    const redirectUri = origin + '/account/callback';
    assert.throws(() => readClubAccountConfig(JSON.stringify({
      ...testConfig, redirectUri,
      client: { ...testConfig.client, productOrigin: origin, redirectAllowlist: [redirectUri] },
    })));
  }
});

void test('ENV-14: post-login navigation accepts internal paths and rejects encoded URL bypasses', () => {
  assert.equal(internalReturnPath('/work?tab=overview#features'), '/work?tab=overview#features');
  for (const path of ['/\\evil.example', '//evil.example', 'https://evil.example', '/%2fevil.example',
    '/%255cevil.example', '/%5cevil.example', '/a/..//evil.example', '/%2e%2e/%2fevil.example',
    '/account/callback', '/api/account/session', '/%61pi/account/session', '/login']) {
    assert.equal(internalReturnPath(path), null, path);
  }
});

void test('V2-01: test deployment properties cannot select another account, Worker, route or D1', t => {
  const directory = mkdtempSync(join(tmpdir(), 'club-targets-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const root = pathToFileURL(directory + '/');
  mkdirSync(new URL('config', root));
  mkdirSync(new URL('secrets', root));
  const configPath = new URL('config/test.properties', root);
  const config = readFileSync(new URL('../config/test.properties', import.meta.url), 'utf8');
  writeFileSync(new URL('secrets/test.properties', root), `MOLIS_CLUB_ACCOUNT_KEY=${'A'.repeat(43)}\n`);
  const wrongTargets = {
    workerName: 'molis-club-production',
    productOrigin: 'https://molis.ai',
    authOrigin: 'https://molis-auth-production.sparkling-silence-0a49.workers.dev',
    databaseName: 'molis-club-production',
    databaseId: '0ec787b0-74f5-4943-ac03-306a438e80e5',
    accountId: 'f'.repeat(32),
  };
  for (const [key, wrong] of Object.entries(wrongTargets)) {
    writeFileSync(configPath, config.replace(new RegExp(`^${key}=.*$`, 'mu'), `${key}=${wrong}`));
    assert.throws(() => clubEnvironment('test', false, root), new RegExp(`invalid field ${key}`, 'u'));
  }
  assert.throws(() => clubEnvironment('prod', false, root), /no approved target/u);

  writeFileSync(configPath, config);
  const { worker } = clubEnvironment('test', false, root);
  assert.equal(worker.name, 'molis-club-staging');
  assert.deepEqual(worker.routes, [{ pattern: 'test.molis.ai', custom_domain: true }]);
  assert.equal(worker.d1_databases[0].database_id, 'bee80a41-8fb5-4271-840c-cfa0493add48');
  assert.equal(worker.d1_databases[0].remote, undefined);
  const local = clubEnvironment('test', true, root);
  assert.equal(local.account.redirectUri, 'http://127.0.0.1:3000/account/callback');
  assert.equal(local.worker.d1_databases[0].remote, true);

  validateClubBuild(structuredClone(worker), worker);
  assert.throws(() => validateClubBuild({ ...worker, routes: [{ pattern: 'molis.ai', custom_domain: true }] }, worker), /routes/u);
  assert.throws(() => validateClubBuild({ ...worker, d1_databases: [...worker.d1_databases, { binding: 'OTHER' }] }, worker), /D1/u);
  assert.throws(() => validateClubBuild({ ...worker, services: [{ binding: 'OTHER', service: 'prod' }] }, worker), /services/u);
});
