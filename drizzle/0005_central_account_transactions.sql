CREATE TABLE `central_account_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`context` text NOT NULL,
	`browser_digest` text NOT NULL,
	`central_id` text NOT NULL,
	`state` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL,
	`lease_until` integer,
	`box` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `central_account_transaction_upstream` ON `central_account_transactions` (`context`,`central_id`);