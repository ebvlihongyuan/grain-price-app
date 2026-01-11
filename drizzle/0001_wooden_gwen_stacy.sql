CREATE TABLE `enterprise_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enterprise_id` varchar(64) NOT NULL,
	`enterprise_name` varchar(128) NOT NULL,
	`region` varchar(64) NOT NULL,
	`grain_type` varchar(32) NOT NULL,
	`price` int NOT NULL,
	`change` decimal(5,2) NOT NULL,
	`monthly_volume` decimal(10,2),
	`yearly_volume` decimal(10,2),
	`data_source` varchar(128) NOT NULL,
	`scraped_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `enterprise_prices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grain_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`region` varchar(64) NOT NULL,
	`grain_type` varchar(32) NOT NULL,
	`price` int NOT NULL,
	`change` decimal(5,2) NOT NULL,
	`data_source` varchar(128) NOT NULL,
	`scraped_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grain_prices_id` PRIMARY KEY(`id`)
);
