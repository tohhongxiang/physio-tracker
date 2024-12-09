import { Exercise } from "~/types";

export default function hasRestBetweenSets(exercise: Exercise) {
	return (exercise.restBetweenSetsSeconds ?? 0) > 0;
}
