import { Exercise } from "~/db/dto";

export default function hasDurationPerRep(exercise: Exercise) {
	return (exercise.durationPerRepSeconds ?? 0) > 0;
}
