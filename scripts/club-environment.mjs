import { isDeepStrictEqual } from 'node:util';
import { id, loadProperties, oneOf } from './environment-properties.mjs';
import targets from '../config/platform-targets.json' with { type: 'json' };

export const root = new URL('../', import.meta.url);
const loopback = targets.dev.productOrigin;
export const port = Number(new URL(loopback).port);

export function clubEnvironment(name, local, configRoot = root) {
  if (local && name === 'prod') throw new Error('Club prod is deploy only');
  const target = targets[name];
  const { config, secrets } = loadProperties(configRoot, name, {
    workerName: oneOf(target?.workerName),
    accountId: oneOf(name === 'dev' ? undefined : targets.platformAccountId),
    databaseName: oneOf(target?.databaseName),
    databaseId: oneOf(target?.databaseId),
    productOrigin: oneOf(target?.productOrigin),
    authOrigin: oneOf(target?.authOrigin),
    environmentId: id, applicationId: id, clientId: id,
    grafanaLogsDestination: value => value === undefined || (name === 'prod' && id(value)),
    localClientId: name === 'test' ? id : oneOf(undefined),
  }, {
    MOLIS_CLUB_ACCOUNT_KEY: value => typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/u.test(value) && Buffer.from(value, 'base64url').toString('base64url') === value,
    MOLIS_CLUB_METRICS_TOKEN: value => value === undefined || (name === 'prod' && /^[A-Za-z0-9_-]{43}$/u.test(value)),
  });
  if (name === 'test' && config.clientId === config.localClientId)
    throw new Error('Club test needs distinct remote and loopback client registrations');
  const productOrigin = local ? loopback : config.productOrigin;
  const domains = [new URL(productOrigin).hostname, ...(target.additionalDomains ?? [])];
  const redirectUri = productOrigin + '/account/callback';
  const account = {
    applicationId: config.applicationId,
    client: {
      clientId: name === 'test' && local ? config.localClientId : config.clientId,
      environmentId: config.environmentId,
      environmentKind: { dev: 'LOCAL', test: 'TEST', prod: 'PRODUCTION' }[name],
      policyProfile: 'unified-account-v2',
      authOrigin: config.authOrigin, productOrigin,
      deliveryMode: 'LIVE', providerMode: 'LIVE', redirectAllowlist: [redirectUri],
    },
    redirectUri,
  };
  return {
    account,
    secrets,
    worker: {
      name: config.workerName,
      ...(config.accountId ? { account_id: config.accountId } : {}),
      main: 'vinext/server/fetch-handler',
      compatibility_date: '2026-09-16',
      compatibility_flags: ['nodejs_compat'],
      preview_urls: false,
      workers_dev: false,
      ...(!local ? {
        observability: config.grafanaLogsDestination ? {
          enabled: true,
          redact_query_string: true,
          logs: {
            enabled: true,
            invocation_logs: false,
            head_sampling_rate: 1,
            persist: false,
            destinations: [config.grafanaLogsDestination],
          },
          traces: { enabled: false },
        } : { enabled: true },
      } : {}),
      ...(!local ? { routes: domains.map(pattern => ({ pattern, custom_domain: true })) } : {}),
      vars: {
        MOLIS_CLUB_ACCOUNT_CONFIG: JSON.stringify(account),
        MOLIS_ENVIRONMENT: name,
      },
      d1_databases: [{
        binding: 'DB', database_name: config.databaseName, database_id: config.databaseId,
        migrations_dir: 'drizzle',
        ...(local && name === 'test' ? { remote: true } : {}),
      }],
    },
  };
}

export function validateClubBuild(built, expected) {
  if (built.route !== undefined || built.env !== undefined)
    throw new Error('Club build added an alternate route or environment');
  for (const field of ['name', 'account_id', 'routes', 'workers_dev', 'preview_urls', 'vars', 'observability']) {
    if (!isDeepStrictEqual(built[field], expected[field]))
      throw new Error(`Club build changed deployment field ${field}`);
  }
  const targetDatabases = databases => databases?.map(({ migrations_dir: _migrationsDir, ...binding }) => binding);
  if (!isDeepStrictEqual(targetDatabases(built.d1_databases), targetDatabases(expected.d1_databases)))
    throw new Error('Club build changed deployment D1 bindings');
  for (const field of ['services', 'r2_buckets', 'kv_namespaces', 'hyperdrive', 'dispatch_namespaces']) {
    if (built[field]?.length) throw new Error(`Club build added undeclared ${field} bindings`);
  }
  if (built.durable_objects?.bindings?.length)
    throw new Error('Club build added undeclared durable object bindings');
}
