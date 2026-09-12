CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`ext` text NOT NULL,
	`mime_type` text NOT NULL,
	`bytes` integer NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`alt_ar` text NOT NULL,
	`original_name` text,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
