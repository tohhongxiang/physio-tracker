import { eq } from "drizzle-orm";
import { db } from "~/db/initalize";
import { exercises, workouts } from "~/db/schema";
import { CreateExercise, Exercise, Workout } from "~/types";

type EditWorkout = Omit<Workout, "exercises"> & {
	exercises: (CreateExercise | Exercise)[];
};

export default async function editWorkout({
	id,
	workout
}: {
	id: Workout["id"];
	workout: EditWorkout;
}) {
	const { exercises: updatedExercises, ...updatedWorkout } = workout;

	const existingWorkout = await db.query.workouts.findFirst({
		where: eq(workouts.id, id),
		with: { exercises: true }
	});
	if (!existingWorkout) throw new Error(`Workout ${id} not found`);

	const existingExerciseIds = existingWorkout.exercises.map(
		(exercise) => exercise.id
	);
	const updatedExerciseIds = updatedExercises
		.filter(isExistingExercise)
		.map((exercise) => exercise.id);

	const exerciseIdsToDelete = existingExerciseIds.filter(
		(exerciseId) => !updatedExerciseIds.includes(exerciseId)
	);

	const result = await db.transaction(async (tx) => {
		// delete exercises
		await Promise.all(
			exerciseIdsToDelete.map((exerciseId) =>
				tx.delete(exercises).where(eq(exercises.id, exerciseId))
			)
		);

		// update workout information
		const finalUpdatedWorkout = await tx
			.update(workouts)
			.set(updatedWorkout)
			.where(eq(workouts.id, id))
			.returning()
			.then((createdRows) => createdRows[0]);

		// update remaining exercises
		const finalUpdatedExercises = await Promise.all(
			updatedExercises.map((exercise) => {
				return isExistingExercise(exercise)
					? tx // update existing exercise
							.update(exercises)
							.set(exercise)
							.where(eq(exercises.id, exercise.id))
							.returning()
							.then((createdRows) => createdRows[0])
					: tx // added new exercise
							.insert(exercises)
							.values({ ...exercise, workoutId: id })
							.returning()
							.then((createdRows) => createdRows[0]);
			})
		);

		return {
			...finalUpdatedWorkout,
			exercises: finalUpdatedExercises
		} as Workout;
	});

	return result;
}

function isExistingExercise(
	exercise: Exercise | CreateExercise
): exercise is Exercise {
	return Object.prototype.hasOwnProperty.call(exercise, "id");
}
