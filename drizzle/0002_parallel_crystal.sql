CREATE TABLE `scraper_configs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enterprise_name` varchar(128) NOT NULL,
	`region` varchar(64) NOT NULL,
	`grain_type` varchar(32) NOT NULL,
	`official_website` varchar(255) NOT NULL,
	`monitoring_url` varchar(255) NOT NULL,
	`update_frequency` enum('daily','weekly') NOT NULL DEFAULT 'daily',
	`enabled` int NOT NULL DEFAULT 1,
	`last_scraped_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scraper_configs_id` PRIMARY KEY(`id`)
);
