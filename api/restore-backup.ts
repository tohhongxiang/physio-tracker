import { eq } from "drizzle-orm";

import {
	ExportData,
	PinnedWorkout,
	PinnedWorkoutSchema,
	WorkoutLog,
	WorkoutLogSchema,
	WorkoutSettings,
	WorkoutSettingsSchema,
	WorkoutWithExercises,
	WorkoutWithExercisesSchema
} from "~/db/dto";
import { db } from "~/db/initalize";
import {
	exercises,
	pinnedWorkouts,
	workoutLogs,
	workoutSettings,
	workouts
} from "~/db/schema";

export default async function restoreBackup(backupData: ExportData) {
	const { data } = backupData;
	return db.transaction(async (tx) => {
		// Restore workouts and exercises
		let createdWorkouts: WorkoutWithExercises[] = [];
		let createdPinnedWorkouts: PinnedWorkout[] = [];
		let createdWorkoutLogs: WorkoutLog[] = [];
		let restoredSettings: WorkoutSettings | null = null;

		if (data.workouts.length > 0) {
			const response = await Promise.all(
				data.workouts.map(async (workout) => {
					const { exercises: workoutExercises, ...restOfWorkout } =
						workout;

					const createdWorkout = await tx
						.insert(workouts)
						.values({
							...restOfWorkout,
							createdAt: restOfWorkout.createdAt?.toISOString(),
							updatedAt: restOfWorkout.updatedAt?.toISOString()
						})
						.returning();

					const createdExercises = await tx
						.insert(exercises)
						.values(
							workoutExercises.map((ex, index) => ({
								...ex,
								workoutId: createdWorkout[0].id,
								position: index,
								createdAt: ex.createdAt?.toISOString(),
								updatedAt: ex.updatedAt?.toISOString()
							}))
						)
						.returning();

					return {
						...createdWorkout[0],
						exercises: createdExercises
					};
				})
			);

			createdWorkouts = response.map((workout) =>
				WorkoutWithExercisesSchema.parse(workout)
			);
		}

		// Restore pinned workouts
		if (data.pinned.length > 0) {
			const result = await tx
				.insert(pinnedWorkouts)
				.values(
					data.pinned.map((pinned) => ({
						...pinned,
						createdAt: (
							pinned as PinnedWorkout
						).createdAt?.toISOString(),
						updatedAt: (
							pinned as PinnedWorkout
						).updatedAt?.toISOString()
					}))
				)
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

		// Restore workout settings (if provided)
		if (data.settings) {
			// Check if settings already exist
			const existingSettings = await tx.query.workoutSettings.findFirst();

			if (existingSettings) {
				// Update existing settings, merging with backup data
				await tx
					.update(workoutSettings)
					.set({
						...data.settings,
						id: 1 // Ensure singleton ID
					})
					.where(eq(workoutSettings.id, 1));
			} else {
				// Insert new settings from backup
				await tx.insert(workoutSettings).values({
					...data.settings,
					id: 1 // Ensure singleton ID
				});
			}

			// Fetch the settings back to get the correct types (booleans from SQLite)
			const restored = await tx.query.workoutSettings.findFirst();
			if (restored) {
				restoredSettings = WorkoutSettingsSchema.parse(restored);
			}
		}

		return {
			workouts: createdWorkouts,
			pinned: createdPinnedWorkouts,
			logs: createdWorkoutLogs,
			settings: restoredSettings
		};
	});
}
