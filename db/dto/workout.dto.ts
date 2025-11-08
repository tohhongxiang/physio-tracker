import { z } from "zod";

import {
	CreateExerciseSchema,
	EditExerciseSchema,
	ExerciseSchema
} from "./exercise.dto";

// Base schema (shared fields, no id/timestamps)
const WorkoutBase = z.object({
	name: z.string().min(1, "Workout name is required"),
	description: z.string().default("")
});

// Create = base
export const CreateWorkoutSchema = WorkoutBase.extend({
	exercises: z.array(CreateExerciseSchema)
});

// Update = partial(base) + id
export const EditWorkoutSchema = WorkoutBase.partial().extend({
	id: z.number().int().positive("Workout ID must be a positive integer"),
	exercises: z.array(z.union([EditExerciseSchema, CreateExerciseSchema]))
});

// Response = base + id + transformed timestamps
export const WorkoutSchema = WorkoutBase.extend({
	id: z.number().int().positive(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
});

export const WorkoutWithExercisesSchema = WorkoutSchema.extend({
	exercises: z.array(ExerciseSchema)
});

// Filters for list endpoints
export const WorkoutFiltersSchema = z.object({
	search: z.string().optional(),
	sortBy: z
		.enum([
			"name_asc",
			"name_desc",
			"dateCreated_asc",
			"dateCreated_desc",
			""
		])
		.optional(),
	limit: z.number().int().positive()
});

// Type exports
export type CreateWorkout = z.infer<typeof CreateWorkoutSchema>;
export type EditWorkout = z.infer<typeof EditWorkoutSchema>;
export type Workout = z.infer<typeof WorkoutSchema>;
export type WorkoutWithExercises = z.infer<typeof WorkoutWithExercisesSchema>;
export type WorkoutFilters = z.infer<typeof WorkoutFiltersSchema>;
