import { between, eq, lt, sql } from "drizzle-orm";
import { prettifyError } from "zod";

import { PinnedWorkoutSchema, WorkoutWithExercises } from "~/db/dto";
import { db } from "~/db/initalize";
import { pinnedWorkouts } from "~/db/schema";

export default async function editPinnedWorkoutPosition({
	workoutId,
	newIndex
}: {
	workoutId: WorkoutWithExercises["id"];
	newIndex: number;
}) {
	const pinnedWorkout = await db.query.pinnedWorkouts.findFirst({
		where: (pinnedWorkout, { eq }) => eq(pinnedWorkout.workoutId, workoutId)
	});

	if (!pinnedWorkout) {
		throw new Error(`Pinned workout ${workoutId} not found`);
	}

	const currentIndex = pinnedWorkout.position;
	if (currentIndex === newIndex) {
		return pinnedWorkout;
	}

	const lowerAffectedIndex = Math.min(currentIndex, newIndex);
	const higherAfffectedIndex = Math.max(currentIndex, newIndex);

	return db.transaction(async (tx) => {
		// Set all the affected workouts to negative range to avoid position unique constraint
		// 0 -> -1, 1 -> -2, 2 -> -3, etc.
		await tx
			.update(pinnedWorkouts)
			.set({ position: sql`-${pinnedWorkouts.position} - 1` })
			.where(
				between(
					pinnedWorkouts.position,
					lowerAffectedIndex,
					higherAfffectedIndex
				)
			);

		// Move the pinned workout to the new position
		const updatedPinnedWorkoutResult = await tx
			.update(pinnedWorkouts)
			.set({ position: newIndex })
			.where(eq(pinnedWorkouts.workoutId, workoutId))
			.returning();

		// All remaining affected workouts have negative index, and need to be shifted to the correct position
		const isPinnedWorkoutMovedBack = currentIndex < newIndex;
		const shift = isPinnedWorkoutMovedBack ? -1 : 1;
		await tx
			.update(pinnedWorkouts)
			.set({ position: sql`-${pinnedWorkouts.position} - 1 + ${shift}` })
			.where(lt(pinnedWorkouts.position, 0));

		const updatedPinnedWorkout = updatedPinnedWorkoutResult[0];
		if (!updatedPinnedWorkout) {
			throw new Error("Unable to update pinned workout");
		}

		const { data: validatedPinnedWorkout, error } =
			PinnedWorkoutSchema.safeParse(updatedPinnedWorkout);

		if (error) {
			throw new Error(prettifyError(error));
		}

		return validatedPinnedWorkout;
	});
}
