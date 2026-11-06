CREATE TABLE `central_account_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`context` text NOT NULL,
	`state` text NOT NULL,
	`epoch` integer DEFAULT 0 NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`user_id` text,
	`login_id` text,
	`token_box` text,
	`access_expires_at` integer,
	`expires_at` integer NOT NULL,
	`public_user` text,
	`public_session` text,
	`pending_nonce` text,
	`pending_expires` integer,
	`refresh_lease` text,
	`refresh_until` integer,
	`logout_key` text,
	`logout_scope` text,
	`logout_result` text,
	`logout_until` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `central_account_context_user` ON `central_account_sessions` (`context`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `central_account_context_login` ON `central_account_sessions` (`context`,`login_id`);