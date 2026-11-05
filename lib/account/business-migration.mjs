import { createHash } from 'node:crypto';

// Operator-only, offline SQLite tooling. Never imported into the browser or request runtime.
const canonical = (value) =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .sort((a, b) => a.localeCompare(b))
            .map((k) => [k, canonical(value[k])]),
        )
      : value;
const digest = (value) =>
  createHash('sha256')
    .update(JSON.stringify(canonical(value)))
    .digest('hex');
const rows = (db, table, id) =>
  db
    .prepare(
      `SELECT * FROM ${table} WHERE ${table === 'user' ? 'id' : 'user_id'}=? ORDER BY id`,
    )
    .all(id);
const snapshot = (db, id) =>
  ['user', 'account', 'session', 'notes'].map((table) => rows(db, table, id));
const must = (value, reason) => {
  if (!value) throw Error(reason);
};
const id = (value) =>
  typeof value === 'string' &&
  /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,199}$/.test(value);
export function inventoryBusinessIdentities(db) {
  const hasMappings = Boolean(
    db
      .prepare(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='central_business_identities'",
      )
      .get(),
  );
  const users = db
    .prepare('SELECT id FROM user ORDER BY id')
    .all()
    .map(({ id }) => {
      const [u, accounts, sessions, notes] = snapshot(db, id),
        user = u[0];
      const mapping =
        hasMappings &&
        db
          .prepare(
            'SELECT issuer,auth_user_id FROM central_business_identities WHERE local_user_id=?',
          )
          .get(id);
      return {
        localUserId: id,
        sourceDigest: digest([u, accounts, sessions, notes]),
        emailPresent: user.email !== null,
        emailVerified: Boolean(user.email_verified),
        providers: [...new Set(accounts.map((a) => a.provider_id))].sort(
          (a, b) => a.localeCompare(b),
        ),
        passwordFormats: [
          ...new Set(
            accounts
              .filter((a) => a.password)
              .map((a) =>
                /^[0-9a-f]+:[0-9a-f]+$/i.test(a.password)
                  ? 'SALT_HEX_PAIR_REQUIRES_REVIEW'
                  : 'UNKNOWN_REQUIRES_REVIEW',
              ),
          ),
        ].sort((a, b) => a.localeCompare(b)),
        oldSessionCount: sessions.length,
        noteCount: notes.length,
        state: mapping ? 'MAPPED' : 'REVIEW_REQUIRED',
      };
    });
  return {
    product: 'CLUB',
    formatVersion: 1,
    users,
    inventoryDigest: digest(users.map((u) => [u.localUserId, u.sourceDigest])),
  };
}

/** A reviewed manifest attests external evidence, not a proof submitted by an end user.
 * Email equality is not an evidence type. Existing credentials/verification are never changed.
 */
export function applyBusinessIdentityDecision(db, decision) {
  must(
    decision &&
      Object.keys(decision)
        .sort((a, b) => a.localeCompare(b))
        .join(',') ===
        [
          'formatVersion',
          'mode',
          'issuer',
          'authUserId',
          'localUserId',
          'status',
          'evidence',
          'evidenceReference',
          'reviewedBy',
          'reviewedAt',
          'sourceDigest',
          'displayName',
        ]
          .sort((a, b) => a.localeCompare(b))
          .join(','),
    'Invalid reviewed decision',
  );
  must(
    decision.formatVersion === 1 &&
      decision.status === 'VERIFIED' &&
      ['LINK', 'NEW'].includes(decision.mode),
    'Decision is not verified',
  );
  must(
    [
      decision.authUserId,
      decision.localUserId,
      decision.evidenceReference,
      decision.reviewedBy,
    ].every(id),
    'Missing review identity or evidence reference',
  );
  const url = new URL(decision.issuer);
  must(
    url.origin === decision.issuer &&
      (url.protocol === 'https:' ||
        (url.protocol === 'http:' &&
          ['127.0.0.1', '[::1]'].includes(url.hostname))),
    'Invalid issuer',
  );
  must(
    Number.isFinite(Date.parse(decision.reviewedAt)) &&
      Date.parse(decision.reviewedAt) <= Date.now() &&
      /^[a-f0-9]{64}$/.test(decision.sourceDigest),
    'Invalid review metadata',
  );
  must(
    decision.mode === 'LINK'
      ? [
          'VERIFIED_EXISTING_LINK',
          'VERIFIED_CREDENTIAL',
          'REVIEWED_OWNER_PROOF',
        ].includes(decision.evidence) && decision.displayName === null
      : decision.evidence === 'REVIEWED_NEW_IDENTITY' &&
          typeof decision.displayName === 'string' &&
          decision.displayName.trim().length > 0 &&
          decision.displayName.length <= 80,
    'Invalid ownership evidence',
  );
  const decisionDigest = digest(
    Object.keys(decision)
      .sort((a, b) => a.localeCompare(b))
      .map((k) => [k, decision[k]]),
  );
  db.exec('BEGIN IMMEDIATE');
  try {
    const existing = db
      .prepare(
        'SELECT * FROM central_business_identities WHERE local_user_id=? OR (issuer=? AND auth_user_id=?)',
      )
      .all(decision.localUserId, decision.issuer, decision.authUserId);
    if (existing.length) {
      must(
        existing.length === 1 && existing[0].decision_digest === decisionDigest,
        'Identity mapping conflict',
      );
      db.exec('COMMIT');
      return { status: 'ALREADY_APPLIED', localUserId: decision.localUserId };
    }
    const user = db
      .prepare('SELECT id FROM user WHERE id=?')
      .get(decision.localUserId);
    if (decision.mode === 'LINK') {
      must(
        user &&
          digest(snapshot(db, decision.localUserId)) === decision.sourceDigest,
        'Source changed or local user missing; review again',
      );
    } else {
      must(
        !user &&
          inventoryBusinessIdentities(db).inventoryDigest ===
            decision.sourceDigest,
        'Inventory changed or user exists; review again',
      );
      const now = Date.now();
      db.prepare(
        'INSERT INTO user(id,name,email,email_verified,image,created_at,updated_at) VALUES (?,?,NULL,0,NULL,?,?)',
      ).run(decision.localUserId, decision.displayName.trim(), now, now);
    }
    db.prepare(
      'INSERT INTO central_business_identities(local_user_id,issuer,auth_user_id,evidence,evidence_reference,reviewed_by,reviewed_at,source_digest,decision_digest,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    ).run(
      decision.localUserId,
      decision.issuer,
      decision.authUserId,
      decision.evidence,
      decision.evidenceReference,
      decision.reviewedBy,
      decision.reviewedAt,
      decision.sourceDigest,
      decisionDigest,
      new Date().toISOString(),
    );
    db.exec('COMMIT');
    return { status: 'APPLIED', localUserId: decision.localUserId };
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
