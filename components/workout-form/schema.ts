import { z } from "zod";

const ExerciseFormSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Name must be at least 1 character long" })
		.default(""),
	description: z.string().default(""),
	sets: z.coerce.number().min(1, { message: "There must be at least 1 set" }),
	repsPerSet: z.coerce
		.number()
		.min(1, { message: "There must be at least 1 rep" }),
	durationPerRepSeconds: z.number().min(0).default(0),
	restBetweenRepsSeconds: z.number().min(0).default(0),
	restBetweenSetsSeconds: z.number().min(0).default(0)
});

export const WorkoutFormSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Name must be at least 1 character long" }),
	description: z.string().default(""),
	exercises: z.array(ExerciseFormSchema).default([])
});

export type WorkoutFormSchemaType = z.infer<typeof WorkoutFormSchema>;
