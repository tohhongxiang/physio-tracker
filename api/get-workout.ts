import { prettifyError } from "zod";

import { WorkoutWithExercisesSchema } from "~/db/dto";
import { db } from "~/db/initalize";

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

	const { data, error } = WorkoutWithExercisesSchema.safeParse(result);
	if (error) {
		throw new Error(prettifyError(error));
	}

	return data;
}
