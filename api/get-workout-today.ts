import { like, sql } from "drizzle-orm";

import { db } from "~/db/initalize";
import { workoutLogs } from "~/db/schema";

export default async function getWorkoutToday() {
	const today = new Date().toISOString().split("T")[0];
	const workoutToday = await db.query.workoutLogs.findFirst({
		where: like(workoutLogs.completedAt, `${today}%`)
	});

	// If we already did a workout today, return null
	if (workoutToday) {
		return null;
	}

	const randomWorkout = await db.query.workouts.findFirst({
		orderBy: sql`RANDOM()`,
		with: {
			exercises: {
				orderBy: (exercises, { asc }) => [
					asc(exercises.position),
					asc(exercises.id)
				]
			}
		}
	});

	if (!randomWorkout) {
		return null;
	}

	return randomWorkout;
}
