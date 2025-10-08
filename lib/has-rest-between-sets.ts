import { Exercise } from "~/db/dto";

export default function hasRestBetweenSets(exercise: Exercise) {
	return (exercise.restBetweenSetsSeconds ?? 0) > 0;
}
