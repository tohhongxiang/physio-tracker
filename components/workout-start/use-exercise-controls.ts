import { useCallback, useState } from "react";
import { Exercise } from "~/types";
import hasDurationPerRep from "~/lib/has-duration-per-rep";
import useCountdownTimer from "~/hooks/use-countdown-timer";
import hasRestBetweenReps from "~/lib/has-rest-between-reps";
import { useFocusEffect } from "expo-router";

export const STATES = {
	READY: "READY",
	STARTING: "STARTING",
	RUNNING: "RUNNING",
	RESTING_REP: "RESTING_REP",
	RESTING_SET: "RESTING_SET"
} as const;

const STARTING_TIME = 10;

export default function useExerciseControls({
	exercise,
	onExerciseComplete,
	onTimerUpdate,
	onTimerComplete
}: {
	exercise: Exercise;
	onExerciseComplete?: () => unknown;
	onTimerUpdate?: ({
		remainingTimeMs,
		totalDurationMs
	}: {
		remainingTimeMs: number;
		totalDurationMs: number;
	}) => unknown;
	onTimerComplete?: () => unknown;
}) {
	const [isRunning, setIsRunning] = useState(false);
	const [state, setState] = useState<keyof typeof STATES>(STATES.READY);
	const [currentRep, setCurrentRep] = useState(1);
	const [currentSet, setCurrentSet] = useState(1);

	useFocusEffect(
		useCallback(() => {
			return () => setIsRunning(false);
		}, [])
	);

	function handleExerciseComplete() {
		setCurrentRep(1);
		setCurrentSet(1);
		setIsRunning(false);
		setState(STATES.READY);
		onExerciseComplete?.();
	}

	function handleSetComplete() {
		if (currentSet === exercise.sets) {
			handleExerciseComplete();
		}

		setCurrentRep(1);
		setCurrentSet((c) => c + 1);

		if (exercise.restBetweenSetsSeconds > 0) {
			setState(STATES.RESTING_SET);
		} else {
			setIsRunning(false);
			setState(STATES.READY);
		}
	}

	function handleStartButtonClicked() {
		if (noTimerForExercise(exercise)) {
			if (currentSet === exercise.sets) {
				handleExerciseComplete();
			} else {
				setCurrentSet((c) => c + 1);
			}

			return;
		}

		setIsRunning((c) => !c);
		if (state === STATES.READY) {
			if (hasDurationPerRep(exercise)) {
				setState(STATES.STARTING);
				return;
			}

			if (hasRestBetweenReps(exercise)) {
				setState(STATES.RESTING_REP);
			} else {
				setState(STATES.RESTING_SET);
			}
		}
	}

	function handleTimerComplete() {
		switch (state) {
			case STATES.STARTING: {
				setState(STATES.RUNNING);
				break;
			}
			case STATES.RUNNING: {
				if (currentRep === exercise.reps) {
					handleSetComplete();
					return;
				} else if (hasRestBetweenReps(exercise)) {
					setState(STATES.RESTING_REP);
				}
				setCurrentRep((c) => c + 1);
				break;
			}
			case STATES.RESTING_REP: {
				if (hasDurationPerRep(exercise)) {
					setState(STATES.RUNNING);
				} else if (currentRep === exercise.reps) {
					handleSetComplete();
				} else {
					setIsRunning(false);
					setCurrentRep((c) => c + 1);
				}
				break;
			}
			case STATES.RESTING_SET: {
				if (hasDurationPerRep(exercise)) {
					setState(STATES.RUNNING);
				} else if (currentSet === exercise.sets) {
					handleExerciseComplete();
				} else {
					setIsRunning(false);
					setCurrentSet((c) => c + 1);
				}
				break;
			}
			default:
				break;
		}
	}

	const [timerKey, setTimerKey] = useState(0); // used to reset timer
	const durationSeconds = getDurationForTimer(exercise, state);
	const timer = useCountdownTimer({
		isPlaying: isRunning,
		durationMs: durationSeconds * 1000,
		onTimerComplete: () => {
			handleTimerComplete();
			onTimerComplete?.();
			return {
				shouldRepeat: isRunning,
				newDurationMs: durationSeconds * 1000
			};
		},
		onTimerUpdate: ({ remainingTimeMs }) => {
			return onTimerUpdate?.({
				remainingTimeMs,
				totalDurationMs: durationSeconds * 1000
			});
		},
		key: timerKey
	});

	function handleRepChange(change: number) {
		setIsRunning(false);
		setState(STATES.READY);
		setTimerKey((c) => c + 1);

		// final rep, final set, do not allow increase
		if (
			currentRep === exercise.reps &&
			currentSet === exercise.sets &&
			change > 0
		) {
			return;
		}

		// first rep, first set, do not allow decrease
		if (currentRep === 1 && currentSet === 1 && change < 0) {
			return;
		}

		// increase after finishing current set
		if (currentRep === exercise.reps && change > 0) {
			setCurrentRep(1);
			setCurrentSet((c) => c + change);
			return;
		}

		// decrease to previous set
		if (currentRep === 1 && currentSet > 1 && change < 0) {
			setCurrentRep(exercise.reps);
			setCurrentSet((c) => c + change);
			return;
		}

		setCurrentRep((c) => c + change);
	}

	function handleSetChange(change: number) {
		setCurrentSet((c) => c + change);
		setCurrentRep(1);
		setIsRunning(false);
		setState(STATES.READY);
		setTimerKey((c) => c + 1);
	}

	return {
		state,
		remainingTimeMs: timer.remainingTimeMs,
		currentRep,
		currentSet,
		isTimerRunning: isRunning,
		changeRep: handleRepChange,
		changeSet: handleSetChange,
		toggleTimer: handleStartButtonClicked
	};
}

function getDurationForTimer(exercise: Exercise, state: keyof typeof STATES) {
	if (noTimerForExercise(exercise)) {
		return 0;
	}

	if (state === STATES.READY || state === STATES.STARTING) {
		if (!hasDurationPerRep(exercise)) {
			if (hasRestBetweenReps(exercise)) {
				return exercise.restBetweenRepsSeconds;
			} else {
				return exercise.restBetweenSetsSeconds;
			}
		}

		return STARTING_TIME;
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

	return -1;
}

function noTimerForExercise(exercise: Exercise) {
	return (
		(exercise.restBetweenRepsSeconds ?? 0) === 0 &&
		(exercise.restBetweenSetsSeconds ?? 0) === 0 &&
		(exercise.durationPerRepSeconds ?? 0) === 0
	);
}
