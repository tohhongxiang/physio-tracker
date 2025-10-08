import { prettifyError } from "zod";

import {
	CreateWorkout,
	CreateWorkoutSchema,
	WorkoutWithExercises,
	WorkoutWithExercisesSchema
} from "~/db/dto";
import { db } from "~/db/initalize";
import { exercises, workouts } from "~/db/schema";

export default async function createWorkout(
	workout: CreateWorkout
): Promise<WorkoutWithExercises> {
	const { data: validatedWorkout, error: parseWorkoutError } =
		CreateWorkoutSchema.safeParse(workout);
	if (parseWorkoutError) {
		throw new Error(prettifyError(parseWorkoutError));
	}

	const { exercises: exercisesToCreate, ...restOfWorkout } = validatedWorkout;
	const response = await db.transaction(async (tx) => {
		const createdWorkout = (
			await tx.insert(workouts).values(restOfWorkout).returning()
		)[0];

		const createdExercises = await tx
			.insert(exercises)
			.values(
				exercisesToCreate.map((exercise, position) => ({
					...exercise,
					workoutId: createdWorkout.id,
					position
				}))
			)
			.returning();

		return { ...createdWorkout, exercises: createdExercises };
	});

	const { data: validatedCreatedWorkout, error: createWorkoutError } =
		WorkoutWithExercisesSchema.safeParse(response);
	if (createWorkoutError) {
		throw new Error(prettifyError(createWorkoutError));
	}

	return validatedCreatedWorkout as WorkoutWithExercises;
}
