import { z } from "zod";

import { PinnedWorkoutSchema } from "./pinned-workout.dto";
import { WorkoutLogSchema } from "./workout-log.dto";
import { WorkoutWithExercisesSchema } from "./workout.dto";

// Export Data Options Schema
export const ExportDataOptionsSchema = z.object({
	workouts: z.boolean().default(true),
	logs: z.boolean().default(true),
	pinned: z.boolean().default(true)
});

// Export Data Schema
export const ExportDataSchema = z.object({
	timestamp: z.iso.datetime(),
	device: z.object({
		platform: z.enum(["ios", "android", "windows", "macos", "web"]),
		version: z.string()
	}),
	data: z.object({
		workouts: z.array(WorkoutWithExercisesSchema),
		logs: z.array(WorkoutLogSchema),
		pinned: z.array(PinnedWorkoutSchema)
	})
});

// Type exports
export type ExportDataOptions = z.infer<typeof ExportDataOptionsSchema>;
export type ExportData = z.infer<typeof ExportDataSchema>;
