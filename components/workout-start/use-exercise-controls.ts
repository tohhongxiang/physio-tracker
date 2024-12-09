import { useState } from "react";
import { DurationExercise, Exercise, RepsExercise } from "~/types";
import hasDurationPerRep from "~/lib/has-duration-per-rep";
import { useCountdownTimer } from "~/hooks/use-countdown-timer";

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
		remainingTimeMs
	}: {
		remainingTimeMs: number;
	}) => unknown;
	onTimerComplete?: () => unknown;
}) {
	const [isRunning, setIsRunning] = useState(false);
	const [state, setState] = useState<keyof typeof STATES>(STATES.READY);
	const [currentRep, setCurrentRep] = useState(1);
	const [currentSet, setCurrentSet] = useState(1);

	function handleStartButtonClicked() {
		setIsRunning((c) => !c);
		if (state === STATES.READY) {
			if (hasDurationPerRep(exercise)) {
				setState(STATES.STARTING);
			} else {
				setState(STATES.RESTING_SET);
			}

			return;
		}
	}

	function handleTimerComplete() {
		if (state === STATES.STARTING) {
			setState(STATES.RUNNING);
			return;
		}

		if (state === STATES.RUNNING) {
			if (
				currentRep === exercise.repsPerSet &&
				currentSet === exercise.sets
			) {
				// fully completed exercise
				setCurrentRep(1);
				setCurrentSet(1);
				setIsRunning(false);
				setState(STATES.READY);
				onExerciseComplete?.();
			} else if (currentRep === exercise.repsPerSet) {
				// completed current set
				setCurrentRep(1);
				setCurrentSet((c) => c + 1);

				if (exercise.restBetweenSetsSeconds) {
					setState(STATES.RESTING_SET);
				} else {
					setIsRunning(false);
					setState(STATES.READY);
				}
			} else {
				setCurrentRep((c) => c + 1);
				setState(STATES.RESTING_REP);
				return;
			}
		}

		if (state === STATES.RESTING_REP || state === STATES.RESTING_SET) {
			if (hasDurationPerRep(exercise)) {
				setState(STATES.RUNNING);
			} else {
				setIsRunning(false);

				if (currentSet === exercise.sets) {
					setCurrentSet(1);
					onExerciseComplete?.();
				} else {
					setCurrentSet((c) => c + 1);
					setState(STATES.READY);
				}
			}
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
				shouldRepeat: false,
				newDurationMs: durationSeconds * 1000
			};
		},
		onTimerUpdate,
		key: timerKey
	});

	function handleRepChange(change: number) {
		setIsRunning(false);
		setState(STATES.READY);
		setTimerKey((c) => c + 1);

		// final rep, final set
		if (
			currentRep === exercise.repsPerSet &&
			currentSet === exercise.sets &&
			change > 0
		) {
			return;
		}

		// first rep, first set
		if (currentRep === 1 && currentSet === 1 && change < 0) {
			return;
		}

		// finished current set
		if (currentRep === exercise.repsPerSet && change > 0) {
			setCurrentRep(1);
			setCurrentSet((c) => c + change);
			return;
		}

		//
		if (currentRep === 1 && currentSet > 1 && change < 0) {
			setCurrentRep(exercise.repsPerSet);
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
	if (state === STATES.READY || state === STATES.STARTING) {
		return STARTING_TIME;
	}

	if (state === STATES.RUNNING) {
		return (exercise as DurationExercise).durationPerRepSeconds;
	}

	if (state === STATES.RESTING_REP) {
		return (exercise as DurationExercise).restBetweenRepsSeconds;
	}

	if (state === STATES.RESTING_SET) {
		return (exercise as RepsExercise).restBetweenSetsSeconds;
	}

	return -1;
}
