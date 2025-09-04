CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`sets` integer DEFAULT 1 NOT NULL,
	`reps` integer DEFAULT 1 NOT NULL,
	`weight` real DEFAULT 0 NOT NULL,
	`weight_unit` text DEFAULT 'kg' NOT NULL,
	`duration_per_rep_seconds` integer DEFAULT 0 NOT NULL,
	`rest_between_reps_seconds` integer DEFAULT 0 NOT NULL,
	`rest_between_sets_seconds` integer DEFAULT 0 NOT NULL,
	`workout_id` integer NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_workout_position_unique` ON `exercises` (`workout_id`,`position`);--> statement-breakpoint
CREATE TABLE `workout_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer NOT NULL,
	`completed_at` text NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL
);
