import type { ProductLogoutRequest } from './contracts/types.ts';

export type SessionState =
  | 'ANONYMOUS'
  | 'ACTIVE'
  | 'REFRESHING'
  | 'LOGGING_OUT'
  | 'EXPIRED';
export interface SessionRow {
  id: string;
  context: string;
  state: SessionState;
  epoch: number;
  version: number;
  user_id: string | null;
  login_id: string | null;
  token_box: string | null;
  access_expires_at: number | null;
  expires_at: number;
  public_user: string | null;
  public_session: string | null;
  pending_nonce: string | null;
  pending_expires: number | null;
  refresh_lease: string | null;
  refresh_until: number | null;
  logout_key: string | null;
  logout_scope: ProductLogoutRequest['scope'] | null;
  logout_result: 'CONFIRMED' | 'UNCONFIRMED' | null;
  logout_until: number | null;
  created_at: number;
}
export interface StoredSession {
  userId: string;
  loginId: string;
  tokenBox: string;
  accessExpiresAt: number;
  expiresAt: number;
  user: string;
  session: string;
}
/** Every transition is one SQL CAS. D1, rather than a Worker-local promise, owns refresh exclusion. */
export function createSessionStore(db: D1Database, context: string) {
  const get = (id: string) =>
    db
      .prepare(
        'SELECT * FROM central_account_sessions WHERE id=? AND context=?',
      )
      .bind(id, context)
      .first<SessionRow>();
  const update = (sql: string, values: (string | number | null)[]) =>
    db
      .prepare(sql)
      .bind(...values)
      .first<SessionRow>();
  return {
    get,
    findLogin(loginId: string) {
      return db
        .prepare(
          'SELECT * FROM central_account_sessions WHERE context=? AND login_id=?',
        )
        .bind(context, loginId)
        .first<SessionRow>();
    },
    async create(id: string, now: number, expires: number) {
      return update(
        "INSERT INTO central_account_sessions(id,context,state,epoch,version,expires_at,created_at) VALUES (?,?,'ANONYMOUS',0,0,?,?) RETURNING *",
        [id, context, expires, now],
      );
    },
    begin(row: SessionRow, nonce: string, expires: number) {
      return update(
        "UPDATE central_account_sessions SET pending_nonce=?,pending_expires=?,version=version+1 WHERE id=? AND context=? AND epoch=? AND version=? AND state IN ('ANONYMOUS','EXPIRED') RETURNING *",
        [nonce, expires, row.id, context, row.epoch, row.version],
      );
    },
    activate(
      row: SessionRow,
      nonce: string,
      id: string,
      data: StoredSession,
      now: number,
    ) {
      return update(
        "UPDATE central_account_sessions SET id=?,state='ACTIVE',epoch=epoch+1,version=version+1,user_id=?,login_id=?,token_box=?,access_expires_at=?,expires_at=?,public_user=?,public_session=?,pending_nonce=NULL,pending_expires=NULL,refresh_lease=NULL,refresh_until=NULL,logout_key=NULL,logout_scope=NULL,logout_result=NULL,logout_until=NULL WHERE id=? AND context=? AND epoch=? AND pending_nonce=? AND pending_expires>? AND state IN ('ANONYMOUS','EXPIRED') RETURNING *",
        [
          id,
          data.userId,
          data.loginId,
          data.tokenBox,
          data.accessExpiresAt,
          data.expiresAt,
          data.user,
          data.session,
          row.id,
          context,
          row.epoch,
          nonce,
          now,
        ],
      );
    },
    cancel(row: SessionRow, nonce: string) {
      return update(
        'UPDATE central_account_sessions SET pending_nonce=NULL,pending_expires=NULL,version=version+1 WHERE id=? AND context=? AND epoch=? AND pending_nonce=? RETURNING *',
        [row.id, context, row.epoch, nonce],
      );
    },
    claim(row: SessionRow, lease: string, until: number) {
      return update(
        "UPDATE central_account_sessions SET state='REFRESHING',token_box=NULL,refresh_lease=?,refresh_until=?,version=version+1 WHERE id=? AND context=? AND state='ACTIVE' AND epoch=? AND version=? RETURNING *",
        [lease, until, row.id, context, row.epoch, row.version],
      );
    },
    refreshed(
      row: SessionRow,
      lease: string,
      data: StoredSession,
      now: number,
    ) {
      return update(
        "UPDATE central_account_sessions SET state='ACTIVE',token_box=?,access_expires_at=?,expires_at=MAX(expires_at,?),public_user=?,public_session=CASE WHEN julianday(json_extract(public_session,'$.lastActiveAt'))>julianday(json_extract(?,'$.lastActiveAt')) THEN public_session ELSE ? END,refresh_lease=NULL,refresh_until=NULL,version=version+1 WHERE id=? AND context=? AND state='REFRESHING' AND epoch=? AND refresh_lease=? AND refresh_until>? RETURNING *",
        [
          data.tokenBox,
          data.accessExpiresAt,
          data.expiresAt,
          data.user,
          data.session,
          data.session,
          row.id,
          context,
          row.epoch,
          lease,
          now,
        ],
      );
    },
    expire(row: SessionRow) {
      return update(
        "UPDATE central_account_sessions SET state='EXPIRED',epoch=epoch+1,version=version+1,token_box=NULL,public_user=NULL,public_session=NULL,pending_nonce=NULL,pending_expires=NULL,refresh_lease=NULL,refresh_until=NULL WHERE id=? AND context=? AND epoch=? AND version=? AND state IN ('ACTIVE','REFRESHING') RETURNING *",
        [row.id, context, row.epoch, row.version],
      );
    },
    cache(row: SessionRow, user: string, session: string, expires: number) {
      return update(
        "UPDATE central_account_sessions SET public_user=?,public_session=CASE WHEN julianday(json_extract(public_session,'$.lastActiveAt'))>julianday(json_extract(?,'$.lastActiveAt')) THEN public_session ELSE ? END,expires_at=MAX(expires_at,?),version=version+1 WHERE id=? AND context=? AND state IN ('ACTIVE','REFRESHING') AND epoch=? AND version=? RETURNING *",
        [
          user,
          session,
          session,
          expires,
          row.id,
          context,
          row.epoch,
          row.version,
        ],
      );
    },
    startLogout(
      row: SessionRow,
      key: string,
      scope: ProductLogoutRequest['scope'],
      until: number,
    ) {
      return update(
        "UPDATE central_account_sessions SET state='LOGGING_OUT',epoch=epoch+1,version=version+1,token_box=NULL,public_user=NULL,public_session=NULL,pending_nonce=NULL,pending_expires=NULL,refresh_lease=NULL,refresh_until=NULL,logout_key=?,logout_scope=?,logout_result=NULL,logout_until=? WHERE id=? AND context=? AND epoch=? AND version=? AND state!='LOGGING_OUT' RETURNING *",
        [key, scope, until, row.id, context, row.epoch, row.version],
      );
    },
    finishLogout(row: SessionRow, result: 'CONFIRMED' | 'UNCONFIRMED') {
      return update(
        "UPDATE central_account_sessions SET state='EXPIRED',logout_result=?,logout_until=NULL,version=version+1 WHERE id=? AND context=? AND state='LOGGING_OUT' AND epoch=? AND logout_key=? RETURNING *",
        [result, row.id, context, row.epoch, row.logout_key],
      );
    },
    abandonLogout(row: SessionRow, now: number) {
      return update(
        "UPDATE central_account_sessions SET state='EXPIRED',logout_result='UNCONFIRMED',logout_until=NULL,version=version+1 WHERE id=? AND context=? AND state='LOGGING_OUT' AND epoch=? AND logout_key=? AND logout_until<=? RETURNING *",
        [row.id, context, row.epoch, row.logout_key, now],
      );
    },
  };
}
export type SessionStore = ReturnType<typeof createSessionStore>;
