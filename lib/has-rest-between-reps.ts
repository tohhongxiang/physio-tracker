import { Exercise } from "~/db/dto";

export default function hasRestBetweenReps(exercise: Exercise) {
	return (exercise.restBetweenRepsSeconds ?? 0) > 0;
}
