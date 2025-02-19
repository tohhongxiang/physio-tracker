import { like } from "drizzle-orm";
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
	includeWorkoutData?: undefined
): Promise<Prettify<Omit<WorkoutLog, "workout">>[]>;
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
	const condition = like(
		workoutLogs.completedAt,
		`${year}-${month.toString().padStart(2, "0")}%`
	); // note: ilike is not supported for sqlite
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
						exercises: true
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
