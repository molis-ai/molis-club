import {
  sqliteTable,
  text,
  index,
  uniqueIndex,
  integer,
} from 'drizzle-orm/sqlite-core';
export const notes = sqliteTable(
  'notes',
  {
    id: text('id').primaryKey(),
    work: text('work').notNull(),
    name: text('name').notNull(),
    body: text('body').notNull(),
    userId: text('user_id').references(() => user.id),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_notes_work_created').on(t.work, t.createdAt)],
);
export const designVotes = sqliteTable(
  'design_votes',
  {
    id: text('id').primaryKey(),
    choice: text('choice').notNull(),
    name: text('name').notNull(),
    reason: text('reason').notNull(),
    borrow: text('borrow').notNull().default(''),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => [index('idx_design_votes_updated').on(t.updatedAt)],
);
// 一次提交一行：id 由表单打开时生成，重试同一个 id 不重复；同一邮箱可以留多条不同的话。
// topic 记从哪里来（enterprise、work、share-artist…），allow_display 是投稿者是否同意展示。
export const applications = sqliteTable('applications', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  idea: text('idea').notNull(),
  topic: text('topic'),
  allowDisplay: integer('allow_display', { mode: 'boolean' })
    .notNull()
    .default(false),
  createdAt: text('created_at').notNull(),
});

const dates = () => ({
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  image: text('image'),
  ...dates(),
});
export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    ...dates(),
  },
  (t) => [index('session_user').on(t.userId)],
);
export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', {
      mode: 'timestamp_ms',
    }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', {
      mode: 'timestamp_ms',
    }),
    scope: text('scope'),
    password: text('password'),
    ...dates(),
  },
  (t) => [index('account_user').on(t.userId)],
);
export const verification = sqliteTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    ...dates(),
  },
  (t) => [index('verification_identifier').on(t.identifier)],
);
export const rateLimit = sqliteTable('rate_limit', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  count: integer('count').notNull(),
  lastRequest: integer('last_request').notNull(),
});

// Central Auth sessions are separate from Better Auth and from local business users.
// The primary key is a digest of the opaque browser Cookie, never its bearer value.
export const centralAccountSessions = sqliteTable(
  'central_account_sessions',
  {
    id: text('id').primaryKey(),
    context: text('context').notNull(),
    state: text('state').notNull(),
    epoch: integer('epoch').notNull().default(0),
    version: integer('version').notNull().default(0),
    userId: text('user_id'),
    loginId: text('login_id'),
    tokenBox: text('token_box'),
    accessExpiresAt: integer('access_expires_at'),
    expiresAt: integer('expires_at').notNull(),
    publicUser: text('public_user'),
    publicSession: text('public_session'),
    pendingNonce: text('pending_nonce'),
    pendingExpires: integer('pending_expires'),
    refreshLease: text('refresh_lease'),
    refreshUntil: integer('refresh_until'),
    logoutKey: text('logout_key'),
    logoutScope: text('logout_scope'),
    logoutResult: text('logout_result'),
    logoutUntil: integer('logout_until'),
    createdAt: integer('created_at').notNull(),
  },
  (t) => [
    index('central_account_context_user').on(t.context, t.userId),
    uniqueIndex('central_account_context_login').on(t.context, t.loginId),
  ],
);

// Pending credential proofs are encrypted and bound to the browser login permit.
export const centralAccountTransactions = sqliteTable(
  'central_account_transactions',
  {
    id: text('id').primaryKey(),
    context: text('context').notNull(),
    browserDigest: text('browser_digest').notNull(),
    centralId: text('central_id').notNull(),
    state: text('state').notNull(),
    version: integer('version').notNull().default(0),
    expiresAt: integer('expires_at').notNull(),
    leaseUntil: integer('lease_until'),
    box: text('box'),
  },
  (t) => [
    uniqueIndex('central_account_transaction_upstream').on(
      t.context,
      t.centralId,
    ),
  ],
);

// A local business user can be linked to exactly one reviewed central identity.
export const centralBusinessIdentities = sqliteTable(
  'central_business_identities',
  {
    localUserId: text('local_user_id')
      .primaryKey()
      .references(() => user.id),
    issuer: text('issuer').notNull(),
    authUserId: text('auth_user_id').notNull(),
    evidence: text('evidence').notNull(),
    evidenceReference: text('evidence_reference').notNull(),
    reviewedBy: text('reviewed_by').notNull(),
    reviewedAt: text('reviewed_at').notNull(),
    sourceDigest: text('source_digest').notNull(),
    decisionDigest: text('decision_digest').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [
    uniqueIndex('central_business_identity_subject').on(t.issuer, t.authUserId),
  ],
);
