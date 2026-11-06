import { AccountFailure, requireAccount } from './errors.ts';

const bytes = new TextEncoder();
const encode = (value: Uint8Array) => btoa(String.fromCharCode(...value));
const decode = (value: string) =>
  Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
/** Domain-separated encryption for short-lived server-side authentication proofs. */
export function createAuthCryptography(
  secret: string | undefined,
  context: string,
) {
  requireAccount(
    typeof secret === 'string' && /^[A-Za-z0-9_-]{43}$/.test(secret),
    503,
    'UNIFIED_CONFIGURATION_INVALID',
  );
  const key = crypto.subtle
    .importKey(
      'raw',
      decode(secret.replaceAll('-', '+').replaceAll('_', '/')),
      'HKDF',
      false,
      ['deriveKey'],
    )
    .then((base) =>
      crypto.subtle.deriveKey(
        {
          name: 'HKDF',
          hash: 'SHA-256',
          salt: bytes.encode(context),
          info: bytes.encode('club-auth-transaction-v1'),
        },
        base,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt'],
      ),
    );
  const aad = (id: string, browser: string) =>
    bytes.encode(JSON.stringify([context, id, browser]));
  return {
    async seal(value: unknown, id: string, browser: string) {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const data = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv, additionalData: aad(id, browser) },
        await key,
        bytes.encode(JSON.stringify(value)),
      );
      return encode(iv) + '.' + encode(new Uint8Array(data));
    },
    async open(value: string, id: string, browser: string): Promise<unknown> {
      try {
        const [iv, data, extra] = value.split('.');
        requireAccount(iv && data && !extra);
        return JSON.parse(
          new TextDecoder().decode(
            await crypto.subtle.decrypt(
              {
                name: 'AES-GCM',
                iv: decode(iv),
                additionalData: aad(id, browser),
              },
              await key,
              decode(data),
            ),
          ),
        );
      } catch {
        throw new AccountFailure(503, 'UNIFIED_CONFIGURATION_INVALID');
      }
    },
  };
}
