import { validateNamed } from './contracts/validate.ts';
import type { ClientEnvironmentConfig } from './contracts/types.ts';
import { AccountFailure, assertServer, requireAccount } from './errors.ts';

export interface ClubAccountConfig {
  client: ClientEnvironmentConfig;
  applicationId: string;
  redirectUri: string;
}
function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function loopback(url: URL): boolean {
  return ['127.0.0.1', '[::1]', 'localhost'].includes(url.hostname);
}
/** A deployment binding, never a request DTO. Missing means explicitly disabled. */
export function readClubAccountConfig(
  raw: string | undefined,
): ClubAccountConfig | null {
  assertServer();
  if (raw === undefined) return null;
  try {
    const value: unknown = JSON.parse(raw);
    requireAccount(
      object(value) &&
        Object.keys(value).sort().join(',') ===
          'applicationId,client,redirectUri',
    );
    requireAccount(validateNamed('ClientEnvironmentConfig', value.client));
    requireAccount(
      validateNamed('Id', value.applicationId) &&
        validateNamed('HttpUrl', value.redirectUri),
    );
    const config = value as unknown as ClubAccountConfig;
    const c = config.client,
      auth = new URL(c.authOrigin),
      product = new URL(c.productOrigin);
    requireAccount(
      auth.origin === c.authOrigin &&
        product.origin === c.productOrigin &&
        auth.origin !== product.origin,
    );
    if (c.environmentKind === 'LOCAL')
      requireAccount(loopback(auth) && loopback(product));
    else
      requireAccount(
        auth.protocol === 'https:' && product.protocol === 'https:',
      );
    if (c.environmentKind === 'PRODUCTION')
      requireAccount(!loopback(auth) && !loopback(product));
    requireAccount(c.redirectAllowlist.includes(config.redirectUri));
    for (const uri of c.redirectAllowlist) {
      const redirect = new URL(uri);
      requireAccount(
        uri === product.origin + '/account/callback' &&
          redirect.origin === product.origin &&
          redirect.pathname === '/account/callback' &&
          !redirect.search &&
          !redirect.hash,
      );
    }
    return Object.freeze({
      ...config,
      client: Object.freeze({
        ...c,
        redirectAllowlist: Object.freeze([
          ...c.redirectAllowlist,
        ]) as unknown as string[],
      }),
    });
  } catch {
    throw new AccountFailure(503, 'UNIFIED_CONFIGURATION_INVALID');
  }
}
