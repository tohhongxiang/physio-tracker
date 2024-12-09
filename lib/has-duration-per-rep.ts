import { Exercise } from "~/types";

export default function hasDurationPerRep(exercise: Exercise) {
	return (exercise.durationPerRepSeconds ?? 0) > 0;
}
