import { Workout } from "~/types";

const MINIMUM_ESTIMATED_DURATION_SECONDS = 60;

const ESTIMATED_REP_DURATION_SECONDS = 2;
const ESTIMATED_REST_BETWEEN_SETS_SECONDS = 30;
const ESTIMATED_REST_BETWEEN_EXERCISES_SECONDS = 30;

export default function getEstimatedWorkoutDurationSeconds(workout: Workout) {
	let rawEstimatedDurationSeconds = 0;

	workout.exercises.forEach((exercise) => {
		const durationForReps =
			(exercise.durationPerRepSeconds > 0
				? exercise.durationPerRepSeconds
				: ESTIMATED_REP_DURATION_SECONDS) *
			exercise.reps *
			exercise.sets;

		const durationForRestBetweenReps =
			exercise.restBetweenRepsSeconds *
			(exercise.reps - 1) *
			exercise.sets;

		const durationForRestBetweenSets =
			(exercise.restBetweenSetsSeconds > 0
				? exercise.restBetweenRepsSeconds
				: ESTIMATED_REST_BETWEEN_SETS_SECONDS) *
			(exercise.sets - 1);

		rawEstimatedDurationSeconds +=
			durationForReps +
			durationForRestBetweenReps +
			durationForRestBetweenSets;
	});

	const durationForRestBetweenExercises =
		(workout.exercises.length - 1) *
		ESTIMATED_REST_BETWEEN_EXERCISES_SECONDS;
	rawEstimatedDurationSeconds += durationForRestBetweenExercises;

	const estimatedDurationMinutes =
		Math.ceil(rawEstimatedDurationSeconds / 60) * 60; // round up to nearest minute

	return Math.max(
		MINIMUM_ESTIMATED_DURATION_SECONDS,
		estimatedDurationMinutes
	); // make sure minimum estimated duration is 1 minute
}
