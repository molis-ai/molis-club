import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assertPortAvailable, selectEnvironment } from './environment-properties.mjs';
import { clubEnvironment, port, root, validateClubBuild } from './club-environment.mjs';
import { sessionGeneration } from './environment-session.mjs';

const [operation, ...args] = process.argv.slice(2);
if (!['start', 'deploy'].includes(operation)) throw new Error('Choose start or deploy');
const local = operation === 'start';
const name = selectEnvironment(args, operation, local ? [] : ['--dry-run']);
const config = clubEnvironment(name, local);
const db = config.worker.d1_databases[0];
if (name === 'prod' && !args.includes('--dry-run') && !config.secrets.MOLIS_CLUB_METRICS_TOKEN)
  throw new Error('Club prod requires the internal metrics read token');

process.env.CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV = 'false';
process.env.CLOUDFLARE_INCLUDE_PROCESS_ENV = 'false';
for (const key of [
  'CLOUDFLARE_ENV',
  'CLOUDFLARE_ACCOUNT_ID',
  'CF_ACCOUNT_ID',
  'CLOUDFLARE_COMPLIANCE_REGION',
  'CLOUDFLARE_API_BASE_URL',
  'CF_API_BASE_URL',
  'WRANGLER_API_ENVIRONMENT',
  'WRANGLER_CI_OVERRIDE_NAME',
  'WRANGLER_CI_GENERATE_PREVIEW_ALIAS',
]) delete process.env[key];

if (local) {
  await assertPortAvailable(port);
  const { createServer } = await import('vite');
  const { createClubViteConfig } = await import('../vite.config.ts');
  const staged = mkdtempSync(join(tmpdir(), 'molis-club-'));
  let server;
  try {
    const configPath = join(staged, 'wrangler.json');
    writeFileSync(configPath, '{}', { mode: 0o600 });
    config.worker.vars.MOLIS_LOCAL_GENERATION = sessionGeneration('club', name);
    writeFileSync(join(staged, '.dev.vars'), `MOLIS_CLUB_ACCOUNT_KEY=${config.secrets.MOLIS_CLUB_ACCOUNT_KEY}\n`, { mode: 0o600 });
    config.worker.secrets = { required: ['MOLIS_CLUB_ACCOUNT_KEY'] };
    server = await createServer({
      ...await createClubViteConfig(config.worker, { local: name, configPath }),
      configFile: false,
      envFile: false,
    });
    await server.listen();
    const signal = AbortSignal.timeout(15000);
    const authCheck = new URL('/api/v2/auth/capabilities', config.account.client.authOrigin);
    authCheck.searchParams.set('clientId', config.account.client.clientId);
    const [health, capabilities] = await Promise.all([
      fetch(config.account.client.productOrigin + '/api/account/environment-health', { signal }),
      fetch(authCheck, { signal, redirect: 'error', headers: { Origin: config.account.client.productOrigin } }),
    ]);
    if (!health.ok) throw new Error('Club D1 is unavailable or has an incompatible schema');
    if (!capabilities.ok) throw new Error('Club client registration or Auth availability check failed');
    console.log(`Club ${name}: ${config.account.client.productOrigin}; Auth ${config.account.client.authOrigin}; D1 ${name === 'dev' ? 'local' : 'remote'} ${db.database_name} (${db.database_id})`);
    const stop = async () => {
      await server.close();
      rmSync(staged, { recursive: true, force: true });
    };
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
  } catch (error) {
    await server?.close();
    rmSync(staged, { recursive: true, force: true });
    throw error;
  }
} else {
  const staged = mkdtempSync(join(tmpdir(), 'molis-club-'));
  const deployConfig = `dist/server/wrangler-${randomUUID()}.json`;
  const run = (entry, flags) => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [entry, ...flags], { cwd: root, stdio: 'inherit' });
    const stop = () => child.kill('SIGTERM');
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      process.off('SIGINT', stop);
      process.off('SIGTERM', stop);
      if (code === 0) resolve();
      else reject(new Error(`Build or deployment failed with ${signal ?? code}`));
    });
  });
  try {
    await run('node_modules/vinext/dist/cli.js', ['build', '--mode', name]);
    const built = JSON.parse(readFileSync(new URL('dist/server/wrangler.json', root), 'utf8'));
    validateClubBuild(built, config.worker);
    // Wrangler resolves the built entry and assets relative to this configuration.
    writeFileSync(new URL(deployConfig, root), JSON.stringify(built), { flag: 'wx', mode: 0o600 });
    const deploy = ['deploy', '--config', deployConfig];
    if (args.includes('--dry-run')) deploy.push('--dry-run');
    else {
      const target = new URL('/api/v2/auth/capabilities', config.account.client.authOrigin);
      target.searchParams.set('clientId', config.account.client.clientId);
      const auth = await fetch(target, {
        redirect: 'error', signal: AbortSignal.timeout(10000),
        headers: { Origin: config.account.client.productOrigin },
      }).catch(() => null);
      if (!auth?.ok) throw new Error('Club deployment Auth or client registration is not ready');
      const schema = [
        'SELECT token_box, pending_nonce, context FROM central_account_sessions LIMIT 0',
        'SELECT box, browser_digest, context FROM central_account_transactions LIMIT 0',
        'SELECT * FROM central_business_identities LIMIT 0',
        'SELECT * FROM applications LIMIT 0',
        'SELECT * FROM notes LIMIT 0',
        ...(name === 'prod' ? [
          'SELECT occurred_at, outcome, duration_ms FROM club_contact_requests LIMIT 0',
          'SELECT method, started_at, expires_at, ended_at, outcome, last_issue FROM club_login_flows LIMIT 0',
        ] : []),
      ].join('; ');
      await run('node_modules/wrangler/bin/wrangler.js', [
        'd1', 'execute', db.database_id, '--remote', '--config', deployConfig, '--command', schema,
      ]);
      const file = join(staged, 'bindings.json');
      writeFileSync(file, JSON.stringify(config.secrets), { mode: 0o600 });
      deploy.push('--secrets-file', file);
    }
    await run('node_modules/wrangler/bin/wrangler.js', deploy);
  } finally {
    rmSync(new URL(deployConfig, root), { force: true });
    rmSync(staged, { recursive: true, force: true });
  }
}
