import { requireAccount } from './errors.ts';
export interface AuthRow {
  id: string;
  context: string;
  browser_digest: string;
  central_id: string;
  state: string;
  version: number;
  expires_at: number;
  lease_until: number | null;
  box: string | null;
}
export function createAuthStore(db: D1Database, context: string) {
  const get = (id: string) =>
    db
      .prepare(
        'SELECT * FROM central_account_transactions WHERE context=? AND id=?',
      )
      .bind(context, id)
      .first<AuthRow>();
  return {
    get,
    find: (central: string) =>
      db
        .prepare(
          'SELECT * FROM central_account_transactions WHERE context=? AND central_id=?',
        )
        .bind(context, central)
        .first<AuthRow>(),
    async create(row: AuthRow) {
      await db
        .prepare(
          'INSERT INTO central_account_transactions(id,context,browser_digest,central_id,state,version,expires_at,box) VALUES(?,?,?,?,?,0,?,?)',
        )
        .bind(
          row.id,
          context,
          row.browser_digest,
          row.central_id,
          row.state,
          row.expires_at,
          row.box,
        )
        .run();
    },
    async claim(row: AuthRow) {
      requireAccount(
        row.expires_at > Date.now() && row.state === 'READY' && row.box,
        409,
        'TRANSACTION_EXPIRED',
      );
      const result = await db
        .prepare(
          "UPDATE central_account_transactions SET state='BUSY',version=version+1,lease_until=? WHERE context=? AND id=? AND version=? AND state='READY' RETURNING *",
        )
        .bind(Date.now() + 60_000, context, row.id, row.version)
        .first<AuthRow>();
      requireAccount(result, 409, 'VERSION_CONFLICT');
      return { ...row, version: row.version + 1, state: 'BUSY' };
    },
    async assert(row: AuthRow) {
      const now = await get(row.id);
      requireAccount(
        now?.state === 'BUSY' &&
          now.version === row.version &&
          now.expires_at > Date.now() &&
          (now.lease_until ?? 0) > Date.now(),
        409,
        'TRANSACTION_EXPIRED',
      );
    },
    async save(row: AuthRow, box: string | null, state = 'READY') {
      const result = await db
        .prepare(
          "UPDATE central_account_transactions SET state=?,box=?,lease_until=NULL,version=version+1 WHERE context=? AND id=? AND version=? AND state='BUSY' RETURNING *",
        )
        .bind(state, box, context, row.id, row.version)
        .first<AuthRow>();
      requireAccount(result, 409, 'VERSION_CONFLICT');
    },
    async cancel(row: AuthRow) {
      await db
        .prepare(
          "UPDATE central_account_transactions SET state='CANCELLED',box=NULL,lease_until=NULL,version=version+1 WHERE context=? AND id=? AND state IN ('READY','BUSY')",
        )
        .bind(context, row.id)
        .run();
    },
  };
}
