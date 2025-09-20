import { asc } from "drizzle-orm";

import { db } from "~/db/initalize";
import { pinnedWorkouts } from "~/db/schema";
import { Workout } from "~/types";

export default async function getPinnedWorkouts(): Promise<Workout[]> {
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

	return result.map((pinnedWorkout) => pinnedWorkout.workout as Workout);
}
