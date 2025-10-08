import { z } from "zod";

import { WorkoutWithExercisesSchema } from "./workout.dto";

// Base
const PinnedWorkoutBase = z.object({
	workoutId: z
		.number()
		.int()
		.positive("Workout ID must be a positive integer"),
	position: z.number().int().min(0, "Position cannot be negative")
});

// Create = base
export const CreatePinnedWorkoutSchema = PinnedWorkoutBase;

// Update = base (same shape, full payload)
export const EditPinnedWorkoutSchema = PinnedWorkoutBase;

// Response = base
export const PinnedWorkoutSchema = PinnedWorkoutBase;

/**
 * DTO for pinned workout with workout details
 */
export const PinnedWorkoutWithWorkoutSchema = z.object({
	workoutId: z.number().int().positive(),
	position: z.number().int().min(0),
	workout: WorkoutWithExercisesSchema
});

export type CreatePinnedWorkout = z.infer<typeof CreatePinnedWorkoutSchema>;
export type EditPinnedWorkout = z.infer<typeof EditPinnedWorkoutSchema>;
export type PinnedWorkout = z.infer<typeof PinnedWorkoutSchema>;
export type PinnedWorkoutWithWorkout = z.infer<
	typeof PinnedWorkoutWithWorkoutSchema
>;
