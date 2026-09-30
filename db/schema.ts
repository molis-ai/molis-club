import { sqliteTable, text, index, integer } from 'drizzle-orm/sqlite-core';
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
export const applications = sqliteTable('applications', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  idea: text('idea').notNull(),
  createdAt: text('created_at').notNull(),
});

const dates = () => ({
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
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
