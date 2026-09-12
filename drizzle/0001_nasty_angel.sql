CREATE TABLE `content_singleton` (
	`key` text PRIMARY KEY NOT NULL,
	`schema_version` integer NOT NULL,
	`data` text NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `event` (
	`slug` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`month_ar` text NOT NULL,
	`title_ar` text NOT NULL,
	`desc_ar` text NOT NULL,
	`href` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `event_order_idx` ON `event` (`order`);