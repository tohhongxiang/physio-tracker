import { Exercise, DurationExercise } from "~/types";

export default function hasDuration(
	exercise: Exercise
): exercise is DurationExercise {
	return Object.prototype.hasOwnProperty.call(
		exercise,
		"durationPerRepSeconds"
	);
}
