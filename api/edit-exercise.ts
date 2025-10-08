import { and, eq } from "drizzle-orm";
import { prettifyError } from "zod";

import { Exercise, ExerciseSchema, Workout } from "~/db/dto";
import { db } from "~/db/initalize";
import { exercises } from "~/db/schema";

export default async function editExercise({
	workoutId,
	exerciseId,
	exercise
}: {
	workoutId: Workout["id"];
	exerciseId: Exercise["id"];
	exercise: Exercise;
}): Promise<Exercise> {
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

	const { data: validatedExercise, error } = ExerciseSchema.safeParse(result);
	if (error) {
		throw new Error(prettifyError(error));
	}

	return validatedExercise;
}
