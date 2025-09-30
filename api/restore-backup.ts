import { db } from "~/db/initalize";
import { exercises, pinnedWorkouts, workoutLogs, workouts } from "~/db/schema";
import { ExportData } from "~/types";

export default async function restoreBackup(backupData: ExportData) {
	return db.transaction(async (tx) => {
		// Restore workouts and exercises
		const createdWorkouts = await Promise.all(
			backupData.data.workouts.map(async (workout) => {
				const { exercises: workoutExercises, ...restOfWorkout } =
					workout;

				const createdWorkout = await tx
					.insert(workouts)
					.values(restOfWorkout)
					.returning();

				const createdExercises = await tx
					.insert(exercises)
					.values(
						workoutExercises.map((ex) => ({
							...ex,
							workoutId: workout.id
						}))
					)
					.returning();

				return { ...createdWorkout[0], exercises: createdExercises };
			})
		);

		// Restore pinned workouts
		const createdPinnedWorkouts = await tx
			.insert(pinnedWorkouts)
			.values(backupData.data.pinned)
			.returning();

		// Restore workout logs
		const createdWorkoutLogs = await tx
			.insert(workoutLogs)
			.values(backupData.data.logs)
			.returning();

		return {
			workouts: createdWorkouts,
			pinned: createdPinnedWorkouts,
			logs: createdWorkoutLogs
		};
	});
}
