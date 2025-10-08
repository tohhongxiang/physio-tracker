import { prettifyError } from "zod";

import {
	PinnedWorkoutWithWorkoutSchema,
	Workout,
	WorkoutWithExercises
} from "~/db/dto";
import { db } from "~/db/initalize";

export default async function getPinnedWorkout(
	workoutId: Workout["id"]
): Promise<WorkoutWithExercises | null> {
	const result = await db.query.pinnedWorkouts.findFirst({
		where: (pinnedWorkout, { eq }) =>
			eq(pinnedWorkout.workoutId, workoutId),
		with: {
			workout: {
				with: {
					exercises: {
						orderBy: (exercises, { asc }) => [
							asc(exercises.position)
						]
					}
				}
			}
		}
	});

	const pinnedWorkout = result;

	if (!pinnedWorkout) {
		return null;
	}

	const { data, error } =
		PinnedWorkoutWithWorkoutSchema.safeParse(pinnedWorkout);
	if (error) {
		throw new Error(prettifyError(error));
	}

	return data.workout;
}
