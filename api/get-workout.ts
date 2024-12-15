import { db } from "~/db/initalize";
import { Workout } from "~/types";

export default async function getWorkout(id: number) {
	const result = await db.query.workouts.findFirst({
		where: (workouts, { eq }) => eq(workouts.id, id),
		with: {
			exercises: true
		}
	});

	if (!result) {
		return null;
	}

	return result as Workout;
}
