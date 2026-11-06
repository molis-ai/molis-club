import type { SessionRow } from './session-store.ts';
import type { TokenSet } from './contracts/types.ts';
import { validateNamed } from './contracts/validate.ts';
import { AccountFailure, assertServer, requireAccount } from './errors.ts';

const encoder = new TextEncoder();
export function randomSessionSecret(): string {
  return encode(crypto.getRandomValues(new Uint8Array(32)));
}
function encode(value: Uint8Array): string {
  return btoa(String.fromCharCode(...value))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}
function decode(value: string): Uint8Array<ArrayBuffer> {
  requireAccount(/^[A-Za-z0-9_-]+$/.test(value));
  return Uint8Array.from(
    atob(value.replaceAll('-', '+').replaceAll('_', '/')),
    (c) => c.charCodeAt(0),
  );
}
export async function digestSessionSecret(value: string): Promise<string> {
  return encode(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', encoder.encode(value)),
    ),
  );
}
type Binding = Pick<SessionRow, 'id' | 'epoch' | 'user_id' | 'login_id'>;
/** The key is a runtime secret, never a Vite/public configuration variable. */
export function createSessionCryptography(
  secret: string | undefined,
  context: string,
) {
  assertServer();
  let bytes: Uint8Array<ArrayBuffer>;
  try {
    requireAccount(
      typeof secret === 'string' && /^[A-Za-z0-9_-]{43}$/.test(secret),
    );
    bytes = decode(secret);
    requireAccount(bytes.length === 32 && encode(bytes) === secret);
  } catch {
    throw new AccountFailure(503, 'UNIFIED_CONFIGURATION_INVALID');
  }
  const base = crypto.subtle.importKey('raw', bytes, 'HKDF', false, [
    'deriveKey',
  ]);
  const derive = async (
    label: string,
    algorithm: AesKeyGenParams | HmacImportParams,
    usage: KeyUsage[],
  ) =>
    crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: encoder.encode(context),
        info: encoder.encode(label),
      },
      await base,
      algorithm,
      false,
      usage,
    );
  const aes = derive(
    'molis-club-token-box-v1',
    { name: 'AES-GCM', length: 256 },
    ['encrypt', 'decrypt'],
  );
  const hmac = derive(
    'molis-club-csrf-v1',
    { name: 'HMAC', hash: 'SHA-256', length: 256 },
    ['sign', 'verify'],
  );
  const aad = (row: Binding) =>
    encoder.encode(
      JSON.stringify([context, row.id, row.epoch, row.user_id, row.login_id]),
    );
  return {
    async csrf(cookie: string) {
      return encode(
        new Uint8Array(
          await crypto.subtle.sign('HMAC', await hmac, encoder.encode(cookie)),
        ),
      );
    },
    async verifyCsrf(cookie: string, value: string | null) {
      if (!value || !/^[A-Za-z0-9_-]{43}$/.test(value)) return false;
      return crypto.subtle.verify(
        'HMAC',
        await hmac,
        decode(value),
        encoder.encode(cookie),
      );
    },
    async seal(tokens: TokenSet, row: Binding) {
      requireAccount(
        validateNamed('TokenSet', tokens),
        503,
        'AUTH_UNAVAILABLE',
      );
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv, additionalData: aad(row) },
        await aes,
        encoder.encode(JSON.stringify(tokens)),
      );
      return `v1.${encode(iv)}.${encode(new Uint8Array(encrypted))}`;
    },
    async open(row: SessionRow): Promise<TokenSet> {
      try {
        requireAccount(typeof row.token_box === 'string');
        const [version, iv, ciphertext, extra] = row.token_box.split('.');
        requireAccount(
          version === 'v1' && iv && ciphertext && extra === undefined,
        );
        const plain = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: decode(iv), additionalData: aad(row) },
          await aes,
          decode(ciphertext),
        );
        const tokens: unknown = JSON.parse(new TextDecoder().decode(plain));
        requireAccount(validateNamed('TokenSet', tokens));
        return tokens as TokenSet;
      } catch {
        throw new AccountFailure(503, 'UNIFIED_CONFIGURATION_INVALID');
      }
    },
  };
}
