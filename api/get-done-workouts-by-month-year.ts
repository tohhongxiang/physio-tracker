import { endOfMonth, startOfMonth } from "date-fns";
import { between } from "drizzle-orm";

import { db } from "~/db/initalize";
import { workoutLogs } from "~/db/schema";
import { WorkoutLog } from "~/types";

/**
 *
 * @param year
 * @param month: 1: January, 2: February, ..., 12: December
 * @param includeWorkoutData Whether to include detailed workout data
 */
export default async function getWorkoutsDoneByYearMonth(
	year: number,
	month: number,
	includeWorkoutData?: false
): Promise<Prettify<Omit<WorkoutLog, "workout">>[]>;
export default async function getWorkoutsDoneByYearMonth(
	year: number,
	month: number,
	includeWorkoutData?: true
): Promise<Prettify<WorkoutLog[]>>;

export default async function getWorkoutsDoneByYearMonth(
	year: number,
	month: number,
	includeWorkoutData: boolean = false
) {
	const start = startOfMonth(
		new Date(`${year}-${month.toString().padStart(2, "0")}-01`)
	).toISOString();
	const end = endOfMonth(
		new Date(`${year}-${month.toString().padStart(2, "0")}-01`)
	).toISOString();
	const condition = between(workoutLogs.completedAt, start, end);

	let result: (Omit<WorkoutLog, "workout" | "completedAt"> & {
		completedAt: string;
	})[] = [];

	if (includeWorkoutData) {
		result = await db.query.workoutLogs.findMany({
			columns: { workoutId: false },
			where: condition,
			with: {
				workout: {
					with: {
						exercises: {
							orderBy: (exercises, { asc }) => [
								asc(exercises.position),
								asc(exercises.id)
							]
						}
					}
				}
			},
			orderBy: (workoutLogs, { desc }) => desc(workoutLogs.completedAt)
		});
	} else {
		result = await db.query.workoutLogs.findMany({
			where: condition,
			orderBy: (workoutLogs, { desc }) => desc(workoutLogs.completedAt)
		});
	}

	return result.map((log) => ({
		...log,
		completedAt: new Date(log.completedAt)
	}));
}
