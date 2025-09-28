import { Platform } from "react-native";

import { db } from "~/db/initalize";
import { ExportData, ExportDataOptions } from "~/types";

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

		data.data.workouts = workouts;
	}

	if (options.logs) {
		const workoutLogs = await db.query.workoutLogs.findMany({
			orderBy: (workoutLogs, { desc }) => [desc(workoutLogs.completedAt)]
		});

		data.data.logs = workoutLogs;
	}

	// Export pinned workouts
	if (options.pinned) {
		const pinnedWorkouts = await db.query.pinnedWorkouts.findMany({
			orderBy: (pinnedWorkouts, { asc }) => [asc(pinnedWorkouts.position)]
		});

		data.data.pinned = pinnedWorkouts;
	}

	return data;
}
