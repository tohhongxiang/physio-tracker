import { prettifyError } from "zod";

import { WorkoutLog, WorkoutLogSchema, WorkoutWithExercises } from "~/db/dto";
import { db } from "~/db/initalize";
import { workoutLogs } from "~/db/schema";

export default async function createWorkoutLog({
	workoutId,
	date = new Date()
}: {
	workoutId: WorkoutWithExercises["id"];
	date?: Date;
}): Promise<WorkoutLog> {
	const workout = await db.query.workouts.findFirst({
		where: (workouts, { eq }) => eq(workouts.id, workoutId)
	});

	if (!workout) {
		throw new Error("Workout not found");
	}

	const dateString = date.toISOString();

	const result = await db
		.insert(workoutLogs)
		.values({ workoutId, completedAt: dateString })
		.returning();

	const createdWorkoutLog = result[0];

	if (!createdWorkoutLog) {
		throw new Error("Failed to create workout log");
	}

	const { data, error } = WorkoutLogSchema.safeParse(createdWorkoutLog);
	if (error) {
		throw new Error(prettifyError(error));
	}

	return data;
}
