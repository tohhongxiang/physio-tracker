import { Exercise } from "~/db/dto";

import { STARTING_TIME_SECONDS, STATES } from "../constants";
import {
	hasRestBetweenReps,
	hasRestBetweenSets,
	hasTimedReps
} from "./exercise-state";

export const resetTimer = ({
	setIsRunning,
	setState,
	setTimerKey
}: {
	setIsRunning: (running: boolean) => void;
	setState: (state: keyof typeof STATES) => void;
	setTimerKey: (updater: (current: number) => number) => void;
}) => {
	setIsRunning(false);
	setState(STATES.READY);
	setTimerKey((c) => c + 1);
};

export const getDurationForTimer = (
	exercise: Exercise,
	state: keyof typeof STATES
) => {
	if (state === STATES.READY) {
		// When in READY state, predict what the first timer duration will be
		if (hasTimedReps(exercise)) {
			return STARTING_TIME_SECONDS;
		} else if (hasRestBetweenReps(exercise)) {
			return exercise.restBetweenRepsSeconds;
		} else if (hasRestBetweenSets(exercise)) {
			return exercise.restBetweenSetsSeconds;
		} else {
			// Non-timer exercise
			return 0;
		}
	}

	if (state === STATES.STARTING) {
		return STARTING_TIME_SECONDS;
	}

	if (state === STATES.RUNNING) {
		return exercise.durationPerRepSeconds;
	}

	if (state === STATES.RESTING_REP) {
		return exercise.restBetweenRepsSeconds;
	}

	if (state === STATES.RESTING_SET) {
		return exercise.restBetweenSetsSeconds;
	}

	return 0;
};
