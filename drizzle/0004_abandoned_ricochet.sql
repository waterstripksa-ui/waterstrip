CREATE TABLE `article` (
	`slug` text PRIMARY KEY NOT NULL,
	`kind_ar` text NOT NULL,
	`date_ar` text NOT NULL,
	`read_ar` text NOT NULL,
	`image_id` text,
	`title_ar` text NOT NULL,
	`lede_ar` text NOT NULL,
	`blocks` text NOT NULL,
	`quote_ar` text DEFAULT '' NOT NULL,
	`quote_by_ar` text DEFAULT '' NOT NULL,
	`tags_ar` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `article_order_idx` ON `article` (`order`);