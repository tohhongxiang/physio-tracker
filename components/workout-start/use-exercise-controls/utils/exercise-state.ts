import { Exercise } from "~/db/dto";

export const hasTimedReps = (exercise: Exercise) => {
	return exercise.durationPerRepSeconds > 0;
};

export const hasRestBetweenReps = (exercise: Exercise) => {
	return exercise.restBetweenRepsSeconds > 0;
};

export const hasRestBetweenSets = (exercise: Exercise) => {
	return exercise.restBetweenSetsSeconds > 0;
};

export const isFirstRep = (currentRep: number) => {
	return currentRep === 1;
};

export const isFirstSet = (currentSet: number) => {
	return currentSet === 1;
};

export const isFinalRep = (currentRep: number, exercise: Exercise) => {
	return currentRep === exercise.reps;
};

export const isFinalSet = (currentSet: number, exercise: Exercise) => {
	return currentSet === exercise.sets;
};

export const isExerciseComplete = (
	currentRep: number,
	currentSet: number,
	exercise: Exercise
) => {
	return isFinalRep(currentRep, exercise) && isFinalSet(currentSet, exercise);
};
