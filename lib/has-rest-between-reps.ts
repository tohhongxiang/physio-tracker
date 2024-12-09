import { Exercise } from "~/types";

export default function hasRestBetweenReps(exercise: Exercise) {
	return (exercise.restBetweenRepsSeconds ?? 0) > 0;
}
