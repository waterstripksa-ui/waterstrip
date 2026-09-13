CREATE TABLE `member` (
	`slug` text PRIMARY KEY NOT NULL,
	`category_ar` text NOT NULL,
	`name_ar` text NOT NULL,
	`logo_id` text,
	`role_ar` text NOT NULL,
	`sector_ar` text NOT NULL,
	`since_ar` text NOT NULL,
	`bio_ar` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `member_order_idx` ON `member` (`order`);