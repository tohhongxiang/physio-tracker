import { z } from "zod";

export const ExerciseFormSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Name must be at least 1 character long" })
		.default(""),
	description: z.string().default(""),
	sets: z.coerce
		.number({ message: "Sets must be a valid number" })
		.int({ message: "Sets must be a whole number" })
		.min(1, { message: "There must be at least 1 set" })
		.safe(),
	reps: z.coerce
		.number({ message: "Reps must be a valid number" })
		.int({ message: "Reps must be a whole number" })
		.min(1, { message: "There must be at least 1 rep" })
		.safe(),
	durationPerRepSeconds: z.number().safe().min(0).default(0),
	restBetweenRepsSeconds: z.number().safe().min(0).default(0),
	restBetweenSetsSeconds: z.number().safe().min(0).default(0)
});

export type ExerciseFormSchemaType = z.infer<typeof ExerciseFormSchema>;

export const WorkoutFormSchema = z.object({
	id: z.number().optional(),
	name: z
		.string()
		.min(1, { message: "Name must be at least 1 character long" }),
	description: z.string().default(""),
	exercises: z
		.array(ExerciseFormSchema)
		.default([])
		.refine((exercises) => exercises.length > 0, {
			message: "There must be at least 1 exercise"
		})
});

export type WorkoutFormSchemaType = z.infer<typeof WorkoutFormSchema>;
