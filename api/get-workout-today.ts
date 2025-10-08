import { and, gte, lt, sql } from "drizzle-orm";
import { prettifyError } from "zod";

import { WorkoutWithExercisesSchema } from "~/db/dto";
import { db } from "~/db/initalize";
import { workoutLogs } from "~/db/schema";

export default async function getWorkoutToday() {
	// Get start and end of today in local timezone
	const now = new Date();
	const startOfToday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate()
	);
	const startOfTomorrow = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + 1
	);

	// Convert to ISO strings (these will be in UTC)
	const startOfTodayUTC = startOfToday.toISOString();
	const startOfTomorrowUTC = startOfTomorrow.toISOString();

	const workoutToday = await db.query.workoutLogs.findFirst({
		where: and(
			gte(workoutLogs.completedAt, startOfTodayUTC),
			lt(workoutLogs.completedAt, startOfTomorrowUTC)
		)
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

	const { data: workout, error: workoutError } =
		WorkoutWithExercisesSchema.safeParse(randomWorkout);
	if (workoutError) {
		throw new Error(prettifyError(workoutError));
	}

	return workout;
}
