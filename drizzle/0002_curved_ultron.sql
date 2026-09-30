CREATE TABLE `design_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`choice` text NOT NULL,
	`name` text NOT NULL,
	`reason` text NOT NULL,
	`borrow` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_design_votes_updated` ON `design_votes` (`updated_at`);