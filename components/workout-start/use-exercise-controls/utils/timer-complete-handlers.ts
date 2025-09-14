import { Exercise } from "~/types";
import { STATES } from "../constants";
import {
	isExerciseComplete,
	isFinalRep,
	hasTimedReps,
	hasRestBetweenReps
} from "./exercise-state";

export const handleRunningComplete = ({
	currentRep,
	currentSet,
	exercise,
	handleExerciseComplete,
	handleSetComplete,
	handleRepComplete
}: {
	currentRep: number;
	currentSet: number;
	exercise: Exercise;
	handleExerciseComplete: () => void;
	handleSetComplete: () => void;
	handleRepComplete: () => void;
}) => {
	if (isExerciseComplete(currentRep, currentSet, exercise)) {
		handleExerciseComplete();
	} else if (isFinalRep(currentRep, exercise)) {
		handleSetComplete();
	} else {
		handleRepComplete();
	}
};

export const handleRestingRepComplete = ({
	currentRep,
	currentSet,
	exercise,
	setState,
	setIsRunning,
	setCurrentRep,
	handleExerciseComplete,
	handleSetComplete
}: {
	currentRep: number;
	currentSet: number;
	exercise: Exercise;
	setState: (state: keyof typeof STATES) => void;
	setIsRunning: (isRunning: boolean) => void;
	setCurrentRep: (updater: (current: number) => number) => void;
	handleExerciseComplete: () => void;
	handleSetComplete: () => void;
}) => {
	if (hasTimedReps(exercise)) {
		setState(STATES.RUNNING);
		return;
	}

	// Handle progression for non-timed exercises after resting between reps
	if (isExerciseComplete(currentRep, currentSet, exercise)) {
		handleExerciseComplete();
	} else if (isFinalRep(currentRep, exercise)) {
		handleSetComplete();
	} else {
		// Advance to next rep
		setIsRunning(false);
		setCurrentRep((c) => c + 1);
	}
};

export const handleRestingSetComplete = ({
	currentRep,
	currentSet,
	exercise,
	setState,
	setIsRunning,
	setCurrentSet,
	handleExerciseComplete
}: {
	currentRep: number;
	currentSet: number;
	exercise: Exercise;
	setState: (state: keyof typeof STATES) => void;
	setIsRunning: (isRunning: boolean) => void;
	setCurrentSet: (updater: (current: number) => number) => void;
	handleExerciseComplete: () => void;
}) => {
	if (hasTimedReps(exercise)) {
		setState(STATES.RUNNING);
		return;
	}

	// Handle progression for non-timed exercises after resting between sets
	if (
		currentSet === exercise.sets &&
		(isFinalRep(currentRep, exercise) || !hasRestBetweenReps(exercise))
	) {
		handleExerciseComplete();
	} else {
		// Advance to next set
		setIsRunning(false);
		setState(STATES.READY);
		if (!hasRestBetweenReps(exercise) || isFinalRep(currentRep, exercise)) {
			setCurrentSet((c) => c + 1);
		}
	}
};
