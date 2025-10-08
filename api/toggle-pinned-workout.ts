import { count, eq, gt, lt, sql } from "drizzle-orm";
import { prettifyError } from "zod";

import { PinnedWorkoutSchema, WorkoutWithExercises } from "~/db/dto";
import { db } from "~/db/initalize";
import { pinnedWorkouts } from "~/db/schema";

export default async function togglePinnedWorkout(
	workoutId: WorkoutWithExercises["id"]
) {
	const workout = await db.query.pinnedWorkouts.findFirst({
		where: (pinnedWorkout, { eq }) => eq(pinnedWorkout.workoutId, workoutId)
	});

	if (!workout) {
		const pinnedWorkoutsCount = await db
			.select({ count: count() })
			.from(pinnedWorkouts);

		const position = pinnedWorkoutsCount[0].count;

		const createdPinnedWorkout = await db
			.insert(pinnedWorkouts)
			.values({ workoutId, position })
			.returning();

		return createdPinnedWorkout[0];
	}

	const result = await db.transaction(async (tx) => {
		const deletedPinnedWorkoutResult = await tx
			.delete(pinnedWorkouts)
			.where(eq(pinnedWorkouts.workoutId, workoutId))
			.returning();

		const deletedPinnedWorkout = deletedPinnedWorkoutResult[0];

		// Convert all the position to negative, to avoid the unique position constraint
		await tx
			.update(pinnedWorkouts)
			.set({ position: sql`-${pinnedWorkouts.position}` })
			.where(gt(pinnedWorkouts.position, deletedPinnedWorkout.position));

		// Move each pinned workout to their new place, which is its original position - 1
		await tx
			.update(pinnedWorkouts)
			.set({ position: sql`-${pinnedWorkouts.position} - 1` })
			.where(lt(pinnedWorkouts.position, 0));

		return deletedPinnedWorkout;
	});

	const { data, error } = PinnedWorkoutSchema.safeParse(result);
	if (error) {
		throw new Error(prettifyError(error));
	}

	return data;
}
