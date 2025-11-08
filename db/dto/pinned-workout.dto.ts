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

export const CreatePinnedWorkoutSchema = PinnedWorkoutBase;

export const EditPinnedWorkoutSchema = PinnedWorkoutBase;

export const PinnedWorkoutSchema = PinnedWorkoutBase.extend({
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
});

export const PinnedWorkoutWithWorkoutSchema = PinnedWorkoutSchema.extend({
	workout: WorkoutWithExercisesSchema
});

export type CreatePinnedWorkout = z.infer<typeof CreatePinnedWorkoutSchema>;
export type EditPinnedWorkout = z.infer<typeof EditPinnedWorkoutSchema>;
export type PinnedWorkout = z.infer<typeof PinnedWorkoutSchema>;
export type PinnedWorkoutWithWorkout = z.infer<
	typeof PinnedWorkoutWithWorkoutSchema
>;
