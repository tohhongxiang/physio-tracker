import { db } from "~/db/initalize";
import { Workout } from "~/types";

export default async function getWorkouts() {
	const result = await db.query.workouts.findMany({
		with: { exercises: true }
	});

	return result as Workout[];
}
