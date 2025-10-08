import { asc } from "drizzle-orm";
import { prettifyError } from "zod";

import { PinnedWorkoutWithWorkoutSchema, WorkoutWithExercises } from "~/db/dto";
import { db } from "~/db/initalize";
import { pinnedWorkouts } from "~/db/schema";

export default async function getPinnedWorkouts(): Promise<
	WorkoutWithExercises[]
> {
	const result = await db.query.pinnedWorkouts.findMany({
		orderBy: asc(pinnedWorkouts.position),
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

	return result.map((item) => {
		const { data: pinnedWorkout, error: pinnedWorkoutError } =
			PinnedWorkoutWithWorkoutSchema.safeParse(item);
		if (pinnedWorkoutError) {
			throw new Error(prettifyError(pinnedWorkoutError));
		}

		return pinnedWorkout.workout;
	});
}
