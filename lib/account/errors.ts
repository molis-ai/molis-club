import type { ErrorResponse } from './contracts/types.ts';

/** Public, structured failure only. Never carries upstream bodies or credentials. */
export class AccountFailure extends Error {
  readonly status: number;
  readonly envelope: ErrorResponse;
  constructor(
    status: number,
    code: ErrorResponse['error']['code'],
    retryAfterSeconds?: number,
  ) {
    super(code);
    this.name = 'AccountFailure';
    this.status = status;
    this.envelope = {
      requestId: crypto.randomUUID(),
      error: {
        code,
        ...(retryAfterSeconds === undefined ? {} : { retryAfterSeconds }),
      },
    } as ErrorResponse;
  }
}
export function requireAccount(
  condition: unknown,
  status = 400,
  code: ErrorResponse['error']['code'] = 'INVALID_REQUEST',
): asserts condition {
  if (!condition) throw new AccountFailure(status, code);
}
export function accountFailure(error: unknown): AccountFailure {
  return error instanceof AccountFailure
    ? error
    : new AccountFailure(503, 'AUTH_UNAVAILABLE');
}
export function assertServer(): void {
  requireAccount(
    typeof window === 'undefined',
    503,
    'UNIFIED_CONFIGURATION_INVALID',
  );
}
