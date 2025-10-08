import { Exercise } from "~/db/dto";

import { isFinalRep, isFirstRep, isFirstSet } from "./exercise-state";

export const canNavigate = ({
	change,
	currentRep,
	currentSet,
	exercise
}: {
	change: number;
	currentRep: number;
	currentSet: number;
	exercise: Exercise;
}) => {
	// Cannot increase if at final rep of final set
	if (
		isFinalRep(currentRep, exercise) &&
		currentSet === exercise.sets &&
		change > 0
	) {
		return false;
	}

	// Cannot decrease if at first rep of first set
	if (isFirstRep(currentRep) && isFirstSet(currentSet) && change < 0) {
		return false;
	}

	return true;
};

export const isSetBoundary = ({
	change,
	currentRep,
	currentSet,
	exercise
}: {
	change: number;
	currentRep: number;
	currentSet: number;
	exercise: Exercise;
}) => {
	if (isFinalRep(currentRep, exercise) && change > 0) {
		return true;
	}

	if (isFirstRep(currentRep) && currentSet > 1 && change < 0) {
		return true;
	}

	return false;
};

export const navigateAcrossSets = ({
	change,
	currentRep,
	exercise,
	setCurrentRep,
	setCurrentSet
}: {
	change: number;
	currentRep: number;
	exercise: Exercise;
	setCurrentRep: (updater: (current: number) => number) => void;
	setCurrentSet: (updater: (current: number) => number) => void;
}) => {
	if (isFinalRep(currentRep, exercise) && change > 0) {
		// Move to first rep of next set
		setCurrentRep(() => 1);
		setCurrentSet((c) => c + change);
	} else {
		// Move to last rep of previous set
		setCurrentRep(() => exercise.reps);
		setCurrentSet((c) => c + change);
	}
};
