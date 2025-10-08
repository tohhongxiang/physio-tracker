import { prettifyError } from "zod";

import { Exercise, ExerciseSchema, Workout } from "~/db/dto";
import { db } from "~/db/initalize";

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

	const { data, error } = ExerciseSchema.safeParse(result);
	if (error) {
		throw new Error(prettifyError(error));
	}

	return data;
}
