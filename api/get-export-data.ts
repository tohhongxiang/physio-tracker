import { Platform } from "react-native";
import { prettifyError } from "zod";

import {
	ExportData,
	ExportDataOptions,
	PinnedWorkoutSchema,
	WorkoutLogSchema,
	WorkoutWithExercisesSchema
} from "~/db/dto";
import { db } from "~/db/initalize";

export default async function getExportData(
	options: ExportDataOptions = {
		workouts: true,
		logs: true,
		pinned: true
	}
) {
	const timestamp = new Date().toISOString();
	// Initialize backup data structure
	const data = {
		timestamp,
		device: {
			platform: Platform.OS,
			version: Platform.Version?.toString()
		},
		data: {
			workouts: [],
			logs: [],
			pinned: []
		}
	} as ExportData;

	if (options.workouts) {
		const workouts = await db.query.workouts.findMany({
			with: {
				exercises: {
					orderBy: (exercises, { asc }) => [
						asc(exercises.position),
						asc(exercises.id)
					]
				}
			},
			orderBy: (workouts, { asc }) => [asc(workouts.id)]
		});

		const validatedWorkouts = workouts.map((workout) => {
			const { data, error } =
				WorkoutWithExercisesSchema.safeParse(workout);
			if (error) {
				throw new Error(prettifyError(error));
			}
			return data;
		});

		data.data.workouts = validatedWorkouts;
	}

	if (options.logs) {
		const workoutLogs = await db.query.workoutLogs.findMany({
			orderBy: (workoutLogs, { desc }) => [desc(workoutLogs.completedAt)]
		});

		const validatedWorkoutLogs = workoutLogs.map((log) => {
			const { data, error } = WorkoutLogSchema.safeParse(log);
			if (error) {
				throw new Error(prettifyError(error));
			}
			return data;
		});

		data.data.logs = validatedWorkoutLogs;
	}

	// Export pinned workouts
	if (options.pinned) {
		const pinnedWorkouts = await db.query.pinnedWorkouts.findMany({
			orderBy: (pinnedWorkouts, { asc }) => [asc(pinnedWorkouts.position)]
		});

		const validatedPinnedWorkouts = pinnedWorkouts.map((workout) => {
			const { data, error } = PinnedWorkoutSchema.safeParse(workout);
			if (error) {
				throw new Error(prettifyError(error));
			}
			return data;
		});

		data.data.pinned = validatedPinnedWorkouts;
	}

	return data;
}
