import { db } from "~/db/initalize";
import { exercises, pinnedWorkouts, workoutLogs, workouts } from "~/db/schema";

export default async function deleteAll() {
	return db.transaction(async (tx) => {
		const deletedPinned = await tx.delete(pinnedWorkouts).returning();
		const deletedLogs = await tx.delete(workoutLogs).returning();
		const deletedExercises = await tx.delete(exercises).returning();
		const deletedWorkouts = await tx.delete(workouts).returning();

		return {
			pinned: deletedPinned.length,
			logs: deletedLogs.length,
			exercises: deletedExercises.length,
			workouts: deletedWorkouts.length
		};
	});
}
