import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import useCountdownTimer from "~/hooks/use-countdown-timer";
import { Exercise } from "~/types";

export const STATES = {
	READY: "READY",
	STARTING: "STARTING",
	RUNNING: "RUNNING",
	RESTING_REP: "RESTING_REP",
	RESTING_SET: "RESTING_SET"
} as const;

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

	const handleExerciseComplete = useCallback(() => {
		setCurrentRep(1);
		setCurrentSet(1);
		setIsRunning(false);
		setState(STATES.READY);
		onExerciseComplete?.();
	}, [onExerciseComplete]);

	const handleStartButtonClicked = useCallback(() => {
		if (noTimerForExercise(exercise)) {
			if (currentSet === exercise.sets) {
				handleExerciseComplete();
			} else {
				setCurrentSet((c) => c + 1);
			}

			return;
		}

		setIsRunning((c) => !c);
		if (state !== STATES.READY) {
			return;
		}

		if (exercise.durationPerRepSeconds > 0) {
			setState(STATES.STARTING);
			return;
		}

		if (exercise.restBetweenRepsSeconds > 0) {
			setState(STATES.RESTING_REP);
		} else {
			setState(STATES.RESTING_SET);
		}
	}, [currentSet, exercise, handleExerciseComplete, state]);

	const handleSetComplete = useCallback(() => {
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
	}, [
		currentSet,
		exercise.restBetweenSetsSeconds,
		exercise.sets,
		handleExerciseComplete
	]);

	const handleRepComplete = useCallback(() => {
		setCurrentRep((c) => c + 1);
		if (exercise.restBetweenRepsSeconds > 0) {
			setState(STATES.RESTING_REP);
		}
	}, [exercise.restBetweenRepsSeconds]);

	const durationSeconds = useMemo(
		() => getDurationForTimer(exercise, state),
		[exercise, state]
	);
	const handleTimerComplete = useCallback(() => {
		switch (state) {
			case STATES.STARTING: {
				setState(STATES.RUNNING);
				break;
			}
			case STATES.RUNNING: {
				if (
					currentRep === exercise.reps &&
					currentSet === exercise.sets
				) {
					// exercise is complete
					handleExerciseComplete();
				} else if (currentRep === exercise.reps) {
					// set is complete
					handleSetComplete();
				} else {
					// rep is complete
					handleRepComplete();
				}
				break;
			}
			case STATES.RESTING_REP: {
				if (exercise.durationPerRepSeconds > 0) {
					setState(STATES.RUNNING);
				} else if (
					currentRep === exercise.reps &&
					currentSet === exercise.sets
				) {
					handleExerciseComplete();
				} else if (currentRep === exercise.reps) {
					handleSetComplete();
				} else {
					setIsRunning(false);
					setCurrentRep((c) => c + 1);
				}
				break;
			}
			case STATES.RESTING_SET: {
				if (exercise.durationPerRepSeconds > 0) {
					setState(STATES.RUNNING);
				} else if (
					currentSet === exercise.sets &&
					(currentRep === exercise.reps ||
						exercise.restBetweenRepsSeconds === 0)
				) {
					handleExerciseComplete();
				} else {
					console.log("Resting set");
					setIsRunning(false);
					if (exercise.restBetweenRepsSeconds > 0) {
						setState(STATES.RESTING_REP);
					} else if (exercise.restBetweenSetsSeconds > 0) {
						setState(STATES.RESTING_SET);
					}

					if (
						exercise.restBetweenRepsSeconds === 0 ||
						currentRep === exercise.reps
					) {
						setCurrentSet((c) => c + 1);
					}
				}
				break;
			}
			default: {
				break;
			}
		}

		onTimerComplete?.();
		return {
			shouldRepeat: isRunning,
			newDurationMs: durationSeconds * 1000
		};
	}, [
		currentRep,
		currentSet,
		durationSeconds,
		exercise.durationPerRepSeconds,
		exercise.reps,
		exercise.restBetweenRepsSeconds,
		exercise.restBetweenSetsSeconds,
		exercise.sets,
		handleExerciseComplete,
		handleRepComplete,
		handleSetComplete,
		isRunning,
		onTimerComplete,
		state
	]);

	const [timerKey, setTimerKey] = useState(0);
	const handleTimerUpdate = useCallback(
		({ remainingTimeMs }: { remainingTimeMs: number }) => {
			return onTimerUpdate?.({
				remainingTimeMs,
				totalDurationMs: durationSeconds * 1000
			});
		},
		[durationSeconds, onTimerUpdate]
	);
	const { restart, remainingTimeMs } = useCountdownTimer({
		isPlaying: isRunning,
		durationMs: durationSeconds * 1000,
		onTimerComplete: handleTimerComplete,
		onTimerUpdate: handleTimerUpdate,
		key: timerKey
	});

	const handleRepChange = useCallback(
		(change: number) => {
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
		},
		[currentRep, currentSet, exercise.reps, exercise.sets]
	);

	const handleSetChange = useCallback(
		(change: number) => {
			if (change < 0) {
				setCurrentSet((c) => Math.max(0, c + change));
			} else {
				setCurrentSet((c) => Math.min(exercise.sets, c + change));
			}

			setCurrentRep(1);
			setIsRunning(false);
			setState(STATES.READY);
			setTimerKey((c) => c + 1);
		},
		[exercise.sets]
	);

	const restartEverything = useCallback(() => {
		setCurrentRep(1);
		setCurrentSet(1);
		setIsRunning(false);
		setState(STATES.READY);
		setTimerKey((c) => c + 1);
		restart();
	}, [restart]);

	return {
		state,
		remainingTimeMs,
		currentRep,
		currentSet,
		isTimerRunning: isRunning,
		changeRep: handleRepChange,
		changeSet: handleSetChange,
		toggleTimer: handleStartButtonClicked,
		restart: restartEverything
	};
}

const STARTING_TIME_SECONDS = 10;
function getDurationForTimer(exercise: Exercise, state: keyof typeof STATES) {
	if (
		(exercise.restBetweenRepsSeconds ?? 0) === 0 &&
		(exercise.restBetweenSetsSeconds ?? 0) === 0 &&
		(exercise.durationPerRepSeconds ?? 0) === 0
	) {
		return 0;
	}

	if (state === STATES.READY || state === STATES.STARTING) {
		if (exercise.durationPerRepSeconds === 0) {
			if (exercise.restBetweenRepsSeconds > 0) {
				return exercise.restBetweenRepsSeconds;
			} else {
				return exercise.restBetweenSetsSeconds;
			}
		}

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

	return -1;
}

function noTimerForExercise(exercise: Exercise) {
	return (
		(exercise.restBetweenRepsSeconds ?? 0) === 0 &&
		(exercise.restBetweenSetsSeconds ?? 0) === 0 &&
		(exercise.durationPerRepSeconds ?? 0) === 0
	);
}
