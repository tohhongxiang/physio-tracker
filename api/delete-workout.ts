import { eq } from "drizzle-orm";
import { prettifyError } from "zod";

import { Workout, WorkoutSchema } from "~/db/dto";
import { db } from "~/db/initalize";
import { workouts } from "~/db/schema";

export async function deleteWorkout(
	workoutId: Workout["id"]
): Promise<Workout> {
	const result = await db
		.delete(workouts)
		.where(eq(workouts.id, workoutId))
		.returning();

	const deletedWorkout = result[0];

	if (!deletedWorkout) {
		throw new Error("Workout not found!");
	}

	const { data, error } = WorkoutSchema.safeParse(deletedWorkout);
	if (error) {
		throw new Error(prettifyError(error));
	}

	return data;
}
