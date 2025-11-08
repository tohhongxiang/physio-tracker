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
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_workout_position_unique` ON `exercises` (`workout_id`,`position`);--> statement-breakpoint
CREATE TABLE `pinned_workouts` (
	`workout_id` integer PRIMARY KEY NOT NULL,
	`position` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pinned_workouts_position_unique` ON `pinned_workouts` (`position`);--> statement-breakpoint
CREATE TABLE `workout_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer NOT NULL,
	`completed_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workout_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`ready_up_duration_seconds` integer DEFAULT 10 NOT NULL,
	`countdown_warning_seconds` integer DEFAULT 3 NOT NULL,
	`sounds_muted_by_default` integer DEFAULT false NOT NULL,
	`haptic_on_timer_start` integer DEFAULT false NOT NULL,
	`haptic_on_warning` integer DEFAULT true NOT NULL,
	`haptic_on_complete` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
