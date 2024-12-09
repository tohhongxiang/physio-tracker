import { Exercise, DurationExercise } from "~/types";

export default function hasDurationPerRep(
	exercise: Exercise
): exercise is DurationExercise {
	return Object.prototype.hasOwnProperty.call(
		exercise,
		"durationPerRepSeconds"
	);
}
