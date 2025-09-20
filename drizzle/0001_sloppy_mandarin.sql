CREATE TABLE `pinned_workouts` (
	`workout_id` integer PRIMARY KEY NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pinned_workouts_position_unique` ON `pinned_workouts` (`position`);