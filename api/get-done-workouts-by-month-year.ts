import { endOfMonth, startOfMonth } from "date-fns";
import { between } from "drizzle-orm";
import { prettifyError } from "zod";

import {
	WorkoutLog,
	WorkoutLogSchema,
	WorkoutLogWithWorkout,
	WorkoutLogWithWorkoutSchema
} from "~/db/dto";
import { db } from "~/db/initalize";
import { workoutLogs } from "~/db/schema";

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
): Promise<WorkoutLog[]>;
export default async function getWorkoutsDoneByYearMonth(
	year: number,
	month: number,
	includeWorkoutData?: true
): Promise<WorkoutLogWithWorkout[]>;

export default async function getWorkoutsDoneByYearMonth(
	year: number,
	month: number,
	includeWorkoutData: boolean = false
): Promise<(WorkoutLogWithWorkout | WorkoutLog)[]> {
	const start = startOfMonth(
		new Date(`${year}-${month.toString().padStart(2, "0")}-01`)
	).toISOString();
	const end = endOfMonth(
		new Date(`${year}-${month.toString().padStart(2, "0")}-01`)
	).toISOString();
	const condition = between(workoutLogs.completedAt, start, end);

	if (includeWorkoutData) {
		const result = await db.query.workoutLogs.findMany({
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

		return result.map((log) => {
			const { data, error } = WorkoutLogWithWorkoutSchema.safeParse(log);
			if (error) {
				throw new Error(prettifyError(error));
			}

			return data;
		});
	} else {
		const result = await db.query.workoutLogs.findMany({
			where: condition,
			orderBy: (workoutLogs, { desc }) => desc(workoutLogs.completedAt)
		});

		return result.map((log) => {
			const { data, error } = WorkoutLogSchema.safeParse(log);
			if (error) {
				throw new Error(prettifyError(error));
			}

			return data;
		});
	}
}
