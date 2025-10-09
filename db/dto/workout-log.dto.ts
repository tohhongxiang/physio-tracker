import { z } from "zod";

import { WorkoutWithExercisesSchema } from "./workout.dto";

// Base schema with date transformation
const WorkoutLogBase = z.object({
	id: z.number().int().positive("Workout log ID must be a positive integer"),
	workoutId: z
		.number()
		.int()
		.positive("Workout ID must be a positive integer"),
	completedAt: z.iso
		.datetime("Completed at must be a valid ISO datetime string")
		.transform((str) => new Date(str))
});

// Create = base
export const CreateWorkoutLogSchema = WorkoutLogBase;

// Update = partial(base) + id
export const EditWorkoutLogSchema = WorkoutLogBase.partial().extend({
	id: z.number().int().positive("Workout log ID must be a positive integer")
});

// Response = base + id
export const WorkoutLogSchema = WorkoutLogBase.extend({
	id: z.number().int().positive()
});

/**
 * DTO for workout log with workout details
 */
export const WorkoutLogWithWorkoutSchema = WorkoutLogBase.extend({
	workout: WorkoutWithExercisesSchema
});

// Type exports
export type CreateWorkoutLog = z.infer<typeof CreateWorkoutLogSchema>;
export type EditWorkoutLog = z.infer<typeof EditWorkoutLogSchema>;
export type WorkoutLog = z.infer<typeof WorkoutLogSchema>;
export type WorkoutLogWithWorkout = z.infer<typeof WorkoutLogWithWorkoutSchema>;
