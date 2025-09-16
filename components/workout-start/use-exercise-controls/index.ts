import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import useCountdownTimer from "~/hooks/use-countdown-timer";
import { Exercise } from "~/types";

import { STATES } from "./constants";
import {
	canNavigate,
	getDurationForTimer,
	handleRestingRepComplete,
	handleRestingSetComplete,
	handleRunningComplete,
	hasRestBetweenReps,
	hasRestBetweenSets,
	hasTimedReps,
	isFinalSet,
	isSetBoundary,
	navigateAcrossSets,
	resetTimer
} from "./utils";

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

	// When the exercise is updated, make sure currentRep and currentSet are valid
	useEffect(() => {
		setCurrentRep((currentRep) => Math.min(currentRep, exercise.reps));
		setCurrentSet((currentSet) => Math.min(currentSet, exercise.sets));
	}, [exercise]);

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

	const handleSetComplete = useCallback(() => {
		if (isFinalSet(currentSet, exercise)) {
			handleExerciseComplete();
		}

		setCurrentRep(1);
		setCurrentSet((c) => c + 1);

		if (hasRestBetweenSets(exercise)) {
			setState(STATES.RESTING_SET);
		} else {
			setIsRunning(false);
			setState(STATES.READY);
		}
	}, [currentSet, exercise, handleExerciseComplete]);

	const handleRepComplete = useCallback(() => {
		setCurrentRep((c) => c + 1);
		if (hasRestBetweenReps(exercise)) {
			setState(STATES.RESTING_REP);
		}
	}, [exercise]);

	const handleStartButtonClicked = useCallback(() => {
		if (state !== STATES.READY) {
			setIsRunning((c) => !c);
			return;
		}

		if (hasTimedReps(exercise)) {
			// Timed reps need a starting countdown
			setIsRunning(true);
			setState(STATES.STARTING);
		} else if (hasRestBetweenReps(exercise)) {
			// No timed reps, but has rest between reps
			setIsRunning(true);
			setState(STATES.RESTING_REP);
		} else if (hasRestBetweenSets(exercise)) {
			// Only rest between sets
			setIsRunning(true);
			setState(STATES.RESTING_SET);
		} else {
			// Non-timer exercise - complete the entire exercise immediately
			handleExerciseComplete();
		}
	}, [exercise, state, handleExerciseComplete]);

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
				handleRunningComplete({
					currentRep,
					currentSet,
					exercise,
					handleExerciseComplete,
					handleSetComplete,
					handleRepComplete
				});
				break;
			}
			case STATES.RESTING_REP: {
				handleRestingRepComplete({
					currentRep,
					currentSet,
					exercise,
					setState,
					setIsRunning,
					setCurrentRep,
					handleExerciseComplete,
					handleSetComplete
				});
				break;
			}
			case STATES.RESTING_SET: {
				handleRestingSetComplete({
					currentRep,
					currentSet,
					exercise,
					setState,
					setIsRunning,
					setCurrentSet,
					handleExerciseComplete
				});
				break;
			}
			default: {
				break;
			}
		}

		if (isRunning) {
			// only call onTimerComplete if the timer actually ran
			onTimerComplete?.();
		}

		return {
			shouldRepeat: isRunning,
			newDurationMs: durationSeconds * 1000
		};
	}, [
		currentRep,
		currentSet,
		durationSeconds,
		exercise,
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
			// Reset timer state first
			resetTimer({ setIsRunning, setState, setTimerKey });

			// Check if navigation is allowed
			if (!canNavigate({ change, currentRep, currentSet, exercise })) {
				return;
			}

			// Check if we need to navigate across sets
			if (isSetBoundary({ change, currentRep, currentSet, exercise })) {
				navigateAcrossSets({
					change,
					currentRep,
					exercise,
					setCurrentRep,
					setCurrentSet
				});
				return;
			}

			// Simple rep navigation within current set
			setCurrentRep((c) => c + change);
		},
		[currentRep, currentSet, exercise]
	);

	const handleSetChange = useCallback(
		(change: number) => {
			if (change < 0) {
				setCurrentSet((c) => Math.max(0, c + change));
			} else {
				setCurrentSet((c) => Math.min(exercise.sets, c + change));
			}

			setCurrentRep(1);
			resetTimer({ setIsRunning, setState, setTimerKey });
		},
		[exercise]
	);

	const restartEverything = useCallback(() => {
		setCurrentRep(1);
		setCurrentSet(1);
		resetTimer({ setIsRunning, setState, setTimerKey });
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
