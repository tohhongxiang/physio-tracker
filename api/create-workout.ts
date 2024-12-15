import { db } from "~/db/initalize";
import { workouts, exercises } from "~/db/schema";
import { CreateWorkout, Workout } from "~/types";

export default async function createWorkout(workout: CreateWorkout) {
	const { exercises: exercisesToCreate, ...restOfWorkout } = workout;

	const response = await db.transaction(async (tx) => {
		const createdWorkout = (
			await tx.insert(workouts).values(restOfWorkout).returning()
		)[0];

		const createdExercises = await tx
			.insert(exercises)
			.values(
				exercisesToCreate.map((exercise) => ({
					...exercise,
					workoutId: createdWorkout.id
				}))
			)
			.returning();

		return { ...createdWorkout, exercises: createdExercises } as Workout;
	});

	return response;
}
