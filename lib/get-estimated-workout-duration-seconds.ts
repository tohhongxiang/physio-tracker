import { Workout } from "~/types";

const ESTIMATED_REP_DURATION_SECONDS = 1;
const ESTIMATED_REST_BETWEEN_SETS_SECONDS = 15;

export default function getEstimatedWorkoutDurationSeconds(workout: Workout) {
	let rawEstimatedDuration = 0;

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

		rawEstimatedDuration +=
			durationForReps +
			durationForRestBetweenReps +
			durationForRestBetweenSets;
	});

	const estimatedDuration = Math.ceil(rawEstimatedDuration / 60) * 60;

	return estimatedDuration;
}
