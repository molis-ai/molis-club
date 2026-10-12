DROP INDEX `applications_email_unique`;--> statement-breakpoint
ALTER TABLE `applications` ADD `topic` text;--> statement-breakpoint
ALTER TABLE `applications` ADD `allow_display` integer DEFAULT false NOT NULL;