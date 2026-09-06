import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
export const notes = sqliteTable(
  'notes',
  {
    id: text('id').primaryKey(),
    work: text('work').notNull(),
    name: text('name').notNull(),
    body: text('body').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_notes_work_created').on(t.work, t.createdAt)],
);
export const applications = sqliteTable('applications', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  idea: text('idea').notNull(),
  createdAt: text('created_at').notNull(),
});
