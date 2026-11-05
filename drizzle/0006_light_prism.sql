-- Rebuild the parent and all three referencing tables without disabling foreign keys.
-- D1's migration transaction makes the whole change atomic, including retained credentials.
CREATE TABLE __identity_migration_guard (unknown_count integer CHECK (unknown_count = 0));
--> statement-breakpoint
INSERT INTO __identity_migration_guard SELECT count(*) FROM sqlite_master WHERE (type = 'table' AND name NOT IN ('account', 'session', 'notes') AND upper(sql) LIKE '%REFERENCES%') OR type IN ('view', 'trigger') OR (type = 'index' AND tbl_name IN ('user', 'account', 'session', 'notes') AND sql IS NOT NULL AND name NOT IN ('user_email_unique', 'account_user', 'session_user', 'session_token_unique', 'idx_notes_work_created'));
--> statement-breakpoint
DROP TABLE __identity_migration_guard;
--> statement-breakpoint
ALTER TABLE user RENAME TO __identity_old_user;
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO user SELECT * FROM __identity_old_user;
--> statement-breakpoint
CREATE TABLE `__identity_new_account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO __identity_new_account SELECT * FROM account;
--> statement-breakpoint
DROP TABLE account;
--> statement-breakpoint
ALTER TABLE __identity_new_account RENAME TO account;
--> statement-breakpoint
CREATE INDEX `account_user` ON `account` (`user_id`);
--> statement-breakpoint
CREATE TABLE `__identity_new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO __identity_new_session SELECT * FROM session;
--> statement-breakpoint
DROP TABLE session;
--> statement-breakpoint
ALTER TABLE __identity_new_session RENAME TO session;
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);
--> statement-breakpoint
CREATE INDEX `session_user` ON `session` (`user_id`);
--> statement-breakpoint
CREATE TABLE __identity_new_notes (id text PRIMARY KEY NOT NULL, work text NOT NULL, name text NOT NULL, body text NOT NULL, user_id text REFERENCES user(id), created_at text NOT NULL);
--> statement-breakpoint
INSERT INTO __identity_new_notes(id,work,name,body,user_id,created_at) SELECT id,work,name,body,user_id,created_at FROM notes;
--> statement-breakpoint
DROP TABLE notes;
--> statement-breakpoint
ALTER TABLE __identity_new_notes RENAME TO notes;
--> statement-breakpoint
CREATE INDEX idx_notes_work_created ON notes(work,created_at);
--> statement-breakpoint
DROP TABLE __identity_old_user;
--> statement-breakpoint
CREATE UNIQUE INDEX user_email_unique ON user(email);
--> statement-breakpoint
CREATE TABLE `central_business_identities` (
	`local_user_id` text PRIMARY KEY NOT NULL,
	`issuer` text NOT NULL,
	`auth_user_id` text NOT NULL,
	`evidence` text NOT NULL,
	`evidence_reference` text NOT NULL,
	`reviewed_by` text NOT NULL,
	`reviewed_at` text NOT NULL,
	`source_digest` text NOT NULL,
	`decision_digest` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`local_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `central_business_identity_subject` ON `central_business_identities` (`issuer`,`auth_user_id`);--> statement-breakpoint
