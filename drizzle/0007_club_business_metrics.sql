CREATE TABLE `club_contact_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`occurred_at` integer NOT NULL,
	`entry` text NOT NULL,
	`outcome` text NOT NULL,
	`duration_ms` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_club_contact_time` ON `club_contact_requests` (`occurred_at`);--> statement-breakpoint
CREATE TABLE `club_login_flows` (
	`id` text PRIMARY KEY NOT NULL,
	`method` text NOT NULL,
	`started_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`ended_at` integer,
	`outcome` text,
	`last_issue` text
);
--> statement-breakpoint
CREATE INDEX `idx_club_login_time` ON `club_login_flows` (`started_at`);