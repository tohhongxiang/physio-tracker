import { eq } from "drizzle-orm";
import { db } from "~/db/initalize";
import { workouts } from "~/db/schema";
import { Workout } from "~/types";

export async function deleteWorkout(workoutId: Workout["id"]) {
	const result = await db
		.delete(workouts)
		.where(eq(workouts.id, workoutId))
		.returning();

	return result[0].id;
}
