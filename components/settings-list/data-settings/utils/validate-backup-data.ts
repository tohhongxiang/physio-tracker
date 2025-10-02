import { z } from "zod";

import { WorkoutFormSchema as WorkoutSchema } from "~/components/workout-form/schema";

// Maybe use drizzle-zod instead

const WorkoutLogSchema = z.object({
	id: z.number().int(),
	workoutId: z.number().int(),
	completedAt: z.string().datetime() // ISO string
});

const PinnedWorkoutSchema = z.object({
	workoutId: z.number().int(),
	position: z.number().int()
});

const ExportDataSchema = z.object({
	timestamp: z.string().datetime(),
	device: z.object({
		platform: z.enum(["ios", "android", "windows", "macos", "web"]),
		version: z.string()
	}),
	data: z.object({
		workouts: z.array(WorkoutSchema),
		logs: z.array(WorkoutLogSchema),
		pinned: z.array(PinnedWorkoutSchema)
	})
});

export default function validateBackupData(data: unknown) {
	if (
		!data ||
		typeof data !== "object" ||
		!(data as Record<string, unknown>)["data"]
	) {
		return ["Invalid backup file"];
	}

	const result = ExportDataSchema.safeParse(data);
	if (!result.success) {
		return result.error.errors.map((err) => {
			const path = err.path.length > 0 ? err.path.join(".") : "root";
			return `${path}: ${err.message}`;
		});
	}

	return [];
}
