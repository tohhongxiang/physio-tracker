import { and, eq } from "drizzle-orm";
import { db } from "~/db/initalize";
import { exercises } from "~/db/schema";
import { Exercise, Workout } from "~/types";

export default async function editExercise({
	workoutId,
	exerciseId,
	exercise
}: {
	workoutId: Workout["id"];
	exerciseId: Exercise["id"];
	exercise: Exercise;
}) {
	const existingExercise = await db.query.exercises.findFirst({
		where: (exercises, { eq, and }) =>
			and(
				eq(exercises.id, exerciseId),
				eq(exercises.workoutId, workoutId)
			)
	});

	if (!existingExercise) {
		throw new Error(
			`Workout ${workoutId} exercise ${exerciseId} not found`
		);
	}

	const result = await db
		.update(exercises)
		.set(exercise)
		.where(
			and(
				eq(exercises.workoutId, workoutId),
				eq(exercises.id, exerciseId)
			)
		)
		.returning()
		.then((updatedRows) => updatedRows[0]);

	return result as Exercise;
}
