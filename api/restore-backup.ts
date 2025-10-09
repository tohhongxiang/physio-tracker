import {
	ExportData,
	PinnedWorkout,
	PinnedWorkoutSchema,
	WorkoutLog,
	WorkoutLogSchema,
	WorkoutWithExercises
} from "~/db/dto";
import { db } from "~/db/initalize";
import { exercises, pinnedWorkouts, workoutLogs, workouts } from "~/db/schema";

export default async function restoreBackup(backupData: ExportData) {
	const { data } = backupData;
	return db.transaction(async (tx) => {
		// Restore workouts and exercises
		let createdWorkouts: WorkoutWithExercises[] = [];
		let createdPinnedWorkouts: PinnedWorkout[] = [];
		let createdWorkoutLogs: WorkoutLog[] = [];

		if (data.workouts.length > 0) {
			createdWorkouts = await Promise.all(
				data.workouts.map(async (workout) => {
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

					return {
						...createdWorkout[0],
						exercises: createdExercises
					};
				})
			);
		}

		// Restore pinned workouts
		if (data.pinned.length > 0) {
			const result = await tx
				.insert(pinnedWorkouts)
				.values(data.pinned)
				.returning();

			createdPinnedWorkouts = result.map((pinned) =>
				PinnedWorkoutSchema.parse(pinned)
			);
		}

		// Restore workout logs
		if (data.logs.length > 0) {
			const result = await tx
				.insert(workoutLogs)
				.values(
					data.logs.map((log) => ({
						...log,
						completedAt: log.completedAt.toISOString()
					}))
				)
				.returning();

			createdWorkoutLogs = result.map((log) =>
				WorkoutLogSchema.parse(log)
			);
		}

		return {
			workouts: createdWorkouts,
			pinned: createdPinnedWorkouts,
			logs: createdWorkoutLogs
		};
	});
}
