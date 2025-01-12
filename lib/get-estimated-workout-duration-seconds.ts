import { Workout } from "~/types";

const MINIMUM_ESTIMATED_DURATION_SECONDS = 60;

const ESTIMATED_REP_DURATION_SECONDS = 1;
const ESTIMATED_REST_BETWEEN_SETS_SECONDS = 15;

export default function getEstimatedWorkoutDurationSeconds(workout: Workout) {
	let rawEstimatedDurationSeconds = 0;

	workout.exercises.forEach((exercise) => {
		const durationForReps =
			(exercise.durationPerRepSeconds ?? ESTIMATED_REP_DURATION_SECONDS) *
			exercise.reps *
			exercise.sets;
		const durationForRestBetweenReps =
			exercise.restBetweenRepsSeconds *
			(exercise.reps - 1) *
			exercise.sets;
		const durationForRestBetweenSets =
			(exercise.restBetweenSetsSeconds ??
				ESTIMATED_REST_BETWEEN_SETS_SECONDS) *
			(exercise.sets - 1);

		rawEstimatedDurationSeconds +=
			durationForReps +
			durationForRestBetweenReps +
			durationForRestBetweenSets;
	});

	const estimatedDuration = Math.ceil(rawEstimatedDurationSeconds / 60) * 60; // round up to nearest minute

	return Math.max(MINIMUM_ESTIMATED_DURATION_SECONDS, estimatedDuration); // make sure minimum estimated duration is 1 minute
}
