import { like, sql } from "drizzle-orm";
import { db } from "~/db/initalize";
import { workoutLogs } from "~/db/schema";

export default async function getWorkoutToday() {
	const today = new Date().toISOString().split("T")[0];
	const workoutToday = await db.query.workoutLogs.findFirst({
		where: like(workoutLogs.completedAt, `${today}%`)
	});

	if (workoutToday) {
		return null;
	}

	const randomWorkout = await db.query.workouts.findFirst({
		orderBy: sql`RANDOM()`,
		with: { exercises: true }
	});

	if (!randomWorkout) {
		return null;
	}

	return randomWorkout;
}
