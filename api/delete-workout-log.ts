import { eq } from "drizzle-orm";

import { db } from "~/db/initalize";
import { workoutLogs } from "~/db/schema";
import { WorkoutLog } from "~/types";

export async function deleteWorkoutLog(workoutLogId: WorkoutLog["id"]) {
	const result = await db
		.delete(workoutLogs)
		.where(eq(workoutLogs.id, workoutLogId))
		.returning();

	const deletedWorkoutLog = result[0];

	if (!deletedWorkoutLog) {
		throw new Error("Workout Log not found!");
	}

	return {
		...deletedWorkoutLog,
		completedAt: new Date(deletedWorkoutLog.completedAt)
	};
}
