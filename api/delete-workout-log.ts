import { eq } from "drizzle-orm";
import { prettifyError } from "zod";

import { WorkoutLogSchema, WorkoutLogWithWorkout } from "~/db/dto";
import { db } from "~/db/initalize";
import { workoutLogs } from "~/db/schema";

export async function deleteWorkoutLog(
	workoutLogId: WorkoutLogWithWorkout["id"]
) {
	const result = await db
		.delete(workoutLogs)
		.where(eq(workoutLogs.id, workoutLogId))
		.returning();

	const deletedWorkoutLog = result[0];

	if (!deletedWorkoutLog) {
		throw new Error("Workout Log not found!");
	}

	const { data, error } = WorkoutLogSchema.safeParse(deletedWorkoutLog);
	if (error) {
		throw new Error(prettifyError(error));
	}

	return data;
}
