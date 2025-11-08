import { z } from "zod";

const ExerciseBase = z.object({
	name: z
		.string()
		.min(1, "Exercise name is required")
		.max(100, "Exercise name must be less than 100 characters"),
	description: z.string().default(""),
	sets: z
		.number()
		.int()
		.positive("Sets must be a positive integer")
		.default(1),
	reps: z
		.number()
		.int()
		.positive("Reps must be a positive integer")
		.default(1),
	weight: z.number().min(0, "Weight cannot be negative").default(0),
	weightUnit: z.enum(["kg", "lbs", "%BW"]).default("kg"),
	durationPerRepSeconds: z
		.number()
		.int()
		.min(0, "Duration per rep cannot be negative")
		.default(0),
	restBetweenRepsSeconds: z
		.number()
		.int()
		.min(0, "Rest between reps cannot be negative")
		.default(0),
	restBetweenSetsSeconds: z
		.number()
		.int()
		.min(0, "Rest between sets cannot be negative")
		.default(0)
});

export const CreateExerciseSchema = ExerciseBase;

export const EditExerciseSchema = ExerciseBase.extend({
	id: z.number().int().positive("Exercise ID must be a positive integer"),
	workoutId: z
		.number()
		.int()
		.positive("Workout ID must be a positive integer"),
	position: z.number().int().min(0, "Position cannot be negative").default(0)
});

export const ExerciseSchema = ExerciseBase.extend({
	id: z.number().int().positive(),
	workoutId: z
		.number()
		.int()
		.positive("Workout ID must be a positive integer"),
	position: z.number().int().min(0, "Position cannot be negative").default(0),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
});

// Type exports
export type CreateExercise = z.infer<typeof CreateExerciseSchema>;
export type EditExercise = z.infer<typeof EditExerciseSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
