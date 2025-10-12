import { db } from "~/db/initalize";
import {
	exercises,
	pinnedWorkouts,
	workoutLogs,
	workoutSettings,
	workouts
} from "~/db/schema";

export interface DeleteAllOptions {
	workouts?: boolean;
	logs?: boolean;
	pinned?: boolean;
	settings?: boolean;
}

export default async function deleteAll(
	options: DeleteAllOptions = {
		workouts: true,
		logs: true,
		pinned: true,
		settings: false
	}
) {
	return db.transaction(async (tx) => {
		let deletedPinned = 0;
		let deletedLogs = 0;
		let deletedExercises = 0;
		let deletedWorkouts = 0;
		let deletedSettings = 0;

		if (options.pinned) {
			const result = await tx.delete(pinnedWorkouts).returning();
			deletedPinned = result.length;
		}

		if (options.logs) {
			const result = await tx.delete(workoutLogs).returning();
			deletedLogs = result.length;
		}

		if (options.workouts) {
			// Delete exercises first (cascades from workouts, but explicit is clearer)
			const resultExercises = await tx.delete(exercises).returning();
			deletedExercises = resultExercises.length;

			const resultWorkouts = await tx.delete(workouts).returning();
			deletedWorkouts = resultWorkouts.length;
		}

		if (options.settings) {
			const result = await tx.delete(workoutSettings).returning();
			deletedSettings = result.length;
		}

		return {
			pinned: deletedPinned,
			logs: deletedLogs,
			exercises: deletedExercises,
			workouts: deletedWorkouts,
			settings: deletedSettings
		};
	});
}
