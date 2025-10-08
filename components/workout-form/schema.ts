import * as z from "zod";

const MAX_NUM = 10000;
export const ExerciseFormSchema = z.object({
	id: z.number().optional(),
	name: z
		.string()
		.min(1, { message: "Name must be at least 1 character long" }),
	description: z.string().default(""),
	sets: z
		.number({ message: "Sets must be a valid number" })
		.int({ message: "Sets must be a whole number" })
		.min(1, { message: "There must be at least 1 set" })
		.max(MAX_NUM, { message: `Sets must be less than ${MAX_NUM}` }),
	reps: z
		.number({ message: "Reps must be a valid number" })
		.int({ message: "Reps must be a whole number" })
		.min(1, { message: "There must be at least 1 rep" })
		.max(MAX_NUM, { message: `Reps must be less than ${MAX_NUM}` }),
	weight: z.coerce
		.number({ message: "Weight must be a valid number" })
		.min(0, { message: "Weight must be at least 0" })
		.max(MAX_NUM, { message: `Weight must be below ${MAX_NUM}` }),
	weightUnit: z.enum(["kg", "lbs", "%BW"]).default("kg"),
	durationPerRepSeconds: z.number().min(0).default(0),
	restBetweenRepsSeconds: z.number().min(0).default(0),
	restBetweenSetsSeconds: z.number().min(0).default(0),
	workoutId: z.number().optional()
});

export type ExerciseFormInput = z.input<typeof ExerciseFormSchema>;
export type ExerciseFormOutput = z.output<typeof ExerciseFormSchema>;

export const WorkoutFormSchema = z.object({
	id: z.number().optional(),
	name: z
		.string()
		.min(1, { message: "Name must be at least 1 character long" }),
	description: z.string().default(""),
	exercises: z
		.array(ExerciseFormSchema)
		.min(1, { message: "There must be at least 1 exercise" })
});

export type WorkoutFormInput = z.input<typeof WorkoutFormSchema>;
export type WorkoutFormOutput = z.output<typeof WorkoutFormSchema>;
