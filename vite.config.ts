import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig, type Plugin } from 'vite';
import { clubEnvironment } from './scripts/club-environment.mjs';
import hostingConfig from './.openai/hosting.json' with { type: 'json' };

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  '00000000-0000-4000-8000-000000000000';

const { d1, r2 } = hostingConfig;
// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

// Vite 8 does not inherit `define` in its dependency optimizer. Vinext's
// prebundled next/link router must not depend on @vite/env installing `process`.
// Reuse only the already-public client definitions, never the host process.env.
const clientDependencyDefines: Plugin = {
  name: 'molis:client-dependency-defines',
  apply: 'serve',
  configEnvironment: {
    order: 'post',
    handler(name, environment) {
      if (name !== 'client') return;
      const define = Object.fromEntries(
        Object.entries(environment.define ?? {}).map(([key, value]) => [
          key,
          typeof value === 'string'
            ? value
            : (JSON.stringify(value) ?? 'undefined'),
        ]),
      );
      return {
        optimizeDeps: {
          rolldownOptions: {
            transform: {
              define: {
                ...define,
                ...environment.optimizeDeps?.rolldownOptions?.transform?.define,
              },
            },
          },
        },
      };
    },
  },
};

const localBindingConfig = {
  main: 'vinext/server/fetch-handler',
  compatibility_flags: ['nodejs_compat'],
  vars: {},
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: 'site-creator-d1',
          database_id:
            SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: 'site-creator-r2',
        },
      ]
    : [],
};

export async function createClubViteConfig(
  config: NonNullable<Parameters<typeof import('@cloudflare/vite-plugin').cloudflare>[0]>['config'] = localBindingConfig,
  options: { local?: 'dev' | 'test'; deployed?: 'test' | 'prod'; configPath?: string } = {},
) {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    define: {
      __MOLIS_ENVIRONMENT__: JSON.stringify(options.local ?? options.deployed ?? null),
    },
    css: { postcss: { plugins: [tailwindcss()] } },
    server: {
      host: '127.0.0.1', port: 3000, strictPort: true,
      ...(isCodexSeatbeltSandbox ? { watch: { useFsEvents: false, usePolling: true } } : {}),
    },
    plugins: [
      vinext(),
      clientDependencyDefines,
      ...(options.local || options.deployed ? [] : [sites()]),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config,
        ...(options.configPath ? { configPath: options.configPath } : {}),
        ...(options.local ? {
          inspectorPort: false as const,
          persistState: { path: options.local === 'dev' ? '.wrangler/state' : '.wrangler/state-test' },
        } : {}),
      }),
    ],
  };
}

export default defineConfig(async ({ command, mode }) => {
  if (command === 'serve') throw new Error('Use npm start -- --env dev|test');
  if (mode !== 'test' && mode !== 'prod') return createClubViteConfig();
  const { worker } = clubEnvironment(mode, false);
  return createClubViteConfig(worker, { deployed: mode });
});
