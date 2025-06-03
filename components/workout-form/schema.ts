import { z } from "zod";

const MAX_NUM = 10000;
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
		.max(MAX_NUM, { message: `Sets must be less than ${MAX_NUM}` }),
	reps: z.coerce
		.number({ message: "Reps must be a valid number" })
		.int({ message: "Reps must be a whole number" })
		.min(1, { message: "There must be at least 1 rep" })
		.max(MAX_NUM, { message: `Reps must be less than ${MAX_NUM}` }),
	weight: z.coerce
		.number({ message: "Weight must be a valid number" })
		.min(0, { message: "Weight must be at least 0" })
		.max(MAX_NUM, { message: `Weight must be below ${MAX_NUM}` }),
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
