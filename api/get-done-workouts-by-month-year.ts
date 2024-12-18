import { like } from "drizzle-orm";
import { db } from "~/db/initalize";
import { workoutLogs } from "~/db/schema";

/**
 *
 * @param year
 * @param month: 1: January, 2: February, ..., 12: December
 */
export default async function getWorkoutsDoneByYearMonth(
	year: number,
	month: number
) {
	const result = await db.query.workoutLogs.findMany({
		where: like(workoutLogs.completedAt, `${year}-${month}%`) // note: ilike is not supported for sqlite
	});

	return result;
}
