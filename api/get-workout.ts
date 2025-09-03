import { db } from "~/db/initalize";
import { Workout } from "~/types";

export default async function getWorkout(id: number) {
	const result = await db.query.workouts.findFirst({
		where: (workouts, { eq }) => eq(workouts.id, id),
		with: {
			exercises: {
				orderBy: (exercises, { asc }) => [
					asc(exercises.position),
					asc(exercises.id)
				]
			}
		}
	});

	if (!result) {
		return null;
	}

	return result as Workout;
}
