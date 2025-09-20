import { db } from "~/db/initalize";
import { Workout } from "~/types";

export default async function getPinnedWorkout(
	workoutId: Workout["id"]
): Promise<Workout | null> {
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

	const pinnedWorkout = result?.workout;

	if (!pinnedWorkout) {
		return null;
	}

	return pinnedWorkout;
}
