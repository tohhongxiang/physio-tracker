import { db } from "~/db/initalize";
import { workoutLogs } from "~/db/schema";
import { Workout } from "~/types";

export default async function createWorkoutLog({
	workoutId,
	date = new Date()
}: {
	workoutId: Workout["id"];
	date?: Date;
}) {
	const dateString = date.toISOString();

	const result = await db
		.insert(workoutLogs)
		.values({ workoutId, completedAt: dateString })
		.returning();

	const createdWorkoutLog = result[0];

	if (!createdWorkoutLog) {
		throw new Error("Failed to create workout log");
	}

	return {
		...createdWorkoutLog,
		completedAt: new Date(createdWorkoutLog.completedAt)
	};
}
