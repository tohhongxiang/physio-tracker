CREATE TABLE `workout_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`ready_up_duration_seconds` integer DEFAULT 10 NOT NULL,
	`countdown_warning_seconds` integer DEFAULT 3 NOT NULL,
	`sounds_muted_by_default` integer DEFAULT false NOT NULL,
	`haptic_on_timer_start` integer DEFAULT false NOT NULL,
	`haptic_on_warning` integer DEFAULT true NOT NULL,
	`haptic_on_complete` integer DEFAULT true NOT NULL
);
