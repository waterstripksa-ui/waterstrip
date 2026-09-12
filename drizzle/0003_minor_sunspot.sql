CREATE TABLE `working_group` (
	`slug` text PRIMARY KEY NOT NULL,
	`no` text NOT NULL,
	`challenge` text NOT NULL,
	`name_ar` text NOT NULL,
	`status_ar` text DEFAULT '' NOT NULL,
	`lead_ar` text NOT NULL,
	`head_ar` text NOT NULL,
	`orgs_ar` text NOT NULL,
	`scope_ar` text NOT NULL,
	`stats` text NOT NULL,
	`recs` text NOT NULL,
	`note_ar` text DEFAULT '' NOT NULL,
	`src` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `working_group_order_idx` ON `working_group` (`order`);