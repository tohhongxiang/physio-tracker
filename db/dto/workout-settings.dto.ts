import { z } from "zod";

// Base schema for workout settings
const WorkoutSettingsBase = z.object({
	id: z.number().int().positive().default(1),
	// Timer Settings
	readyUpDurationSeconds: z
		.number()
		.int()
		.min(3, "Ready up duration must be at least 3 seconds")
		.max(30, "Ready up duration must be at most 30 seconds"),
	countdownWarningSeconds: z
		.number()
		.int()
		.min(1, "Countdown warning must be at least 1 second")
		.max(10, "Countdown warning must be at most 10 seconds"),
	// Sound Settings
	soundsMutedByDefault: z.boolean(),
	// Haptic Settings
	hapticOnTimerStart: z.boolean(),
	hapticOnWarning: z.boolean(),
	hapticOnComplete: z.boolean()
});

// Full settings response schema
export const WorkoutSettingsSchema = WorkoutSettingsBase;

// Update schema - partial of base, excluding id (singleton table)
export const UpdateWorkoutSettingsSchema = WorkoutSettingsBase.omit({
	id: true
}).partial();

// Type exports
export type WorkoutSettings = z.infer<typeof WorkoutSettingsSchema>;
export type UpdateWorkoutSettings = z.infer<typeof UpdateWorkoutSettingsSchema>;
