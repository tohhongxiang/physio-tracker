import { db } from "~/db/initalize";
import { Exercise, Workout } from "~/types";

export default async function getExercise(
	workoutId: Workout["id"],
	exerciseId: Exercise["id"]
) {
	const result = await db.query.exercises.findFirst({
		where: (exercises, { eq, and }) =>
			and(
				eq(exercises.id, exerciseId),
				eq(exercises.workoutId, workoutId)
			)
	});

	if (!result) {
		return null;
	}

	return result as Exercise;
}
