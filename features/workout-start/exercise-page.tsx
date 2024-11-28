import { useState } from "react";
import { View } from "react-native";
import { DurationExercise, Exercise, RepsExercise } from "~/types";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import CountdownTimer from "~/components/countdown-timer";
import { ChevronsLeft } from "~/lib/icons/ChevronsLeft";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { Pause } from "~/lib/icons/Pause";
import { Play } from "~/lib/icons/Play";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { ChevronsRight } from "~/lib/icons/ChevronsRight";
import hasDuration from "~/lib/has-duration";

const STATES = {
	READY: "READY",
	STARTING: "STARTING",
	RUNNING: "RUNNING",
	RESTING_REP: "RESTING_REP",
	RESTING_SET: "RESTING_SET"
} as const;

const STARTING_TIME = 10;

export default function ExercisePage({
	exercise,
	onExerciseComplete
}: {
	exercise: Exercise;
	onExerciseComplete?: () => unknown;
}) {
	const [isRunning, setIsRunning] = useState(false);
	const [state, setState] = useState<keyof typeof STATES>(STATES.READY);
	const [currentRep, setCurrentRep] = useState(1);
	const [currentSet, setCurrentSet] = useState(1);

	function handleStartButtonClicked() {
		setIsRunning((c) => !c);
		if (state === STATES.READY) {
			if (hasDuration(exercise)) {
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
			if (hasDuration(exercise)) {
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
	function handleRepChange(change: number) {
		setCurrentRep((c) => c + change);
		setIsRunning(false);
		setState(STATES.READY);
		setTimerKey((c) => c + 1);
	}

	function handleSetChange(change: number) {
		setCurrentSet((c) => c + change);
		setCurrentRep(1);
		setIsRunning(false);
		setState(STATES.READY);
		setTimerKey((c) => c + 1);
	}

	const durationSeconds = getDurationForTimer(exercise, state);

	return (
		<View className="flex flex-1 flex-col gap-8">
			<View className="flex grow items-center justify-center gap-8">
				<CountdownTimer
					key={timerKey}
					isPlaying={isRunning}
					durationSeconds={durationSeconds}
					onTimerComplete={handleTimerComplete}
				/>
				<Text className="text-3xl font-light tracking-wider">
					{state}
				</Text>
				<View className="flex w-full flex-row justify-around py-4">
					<View className="flex flex-col items-center justify-center rounded-md bg-secondary px-8 py-4">
						<Text className="text-muted-foreground">REPS</Text>
						<Text className="text-2xl font-semibold">
							{hasDuration(exercise)
								? `${currentRep} / ${exercise.repsPerSet}`
								: exercise.repsPerSet}
						</Text>
					</View>
					<View className="flex flex-col items-center justify-center rounded-md bg-secondary px-8 py-4">
						<Text className="text-muted-foreground">SETS</Text>
						<Text className="text-2xl font-semibold">
							{currentSet} / {exercise.sets}
						</Text>
					</View>
				</View>
			</View>
			<View className="flex flex-1 flex-row items-center justify-around gap-2 p-4">
				<Button
					variant="secondary"
					className="native:h-fit h-fit"
					disabled={currentSet === 1}
					onPress={() => handleSetChange(-1)}
				>
					<ChevronsLeft className="text-secondary-foreground" />
					<Text className="text-center">Set</Text>
				</Button>
				<Button
					variant="secondary"
					className="native:h-fit h-fit"
					disabled={currentRep === 1}
					onPress={() => handleRepChange(-1)}
				>
					<ChevronLeft className="text-secondary-foreground" />
					<Text className="text-center">Rep</Text>
				</Button>
				<Button
					size="lg"
					className="native:h-28 native:w-28 h-28 w-28 rounded-full p-4"
					onPress={handleStartButtonClicked}
				>
					{isRunning ? (
						<Pause className="text-primary-foreground" />
					) : (
						<Play className="text-primary-foreground" />
					)}
				</Button>
				<Button
					variant="secondary"
					className="native:h-fit h-fit px-4 py-2"
					onPress={() => handleRepChange(1)}
					disabled={currentRep === exercise.repsPerSet}
				>
					<View>
						<ChevronRight className="text-secondary-foreground" />
						<Text className="text-center text-secondary-foreground">
							Rep
						</Text>
					</View>
				</Button>
				<Button
					className="native:h-fit h-fit px-4 py-2"
					variant="secondary"
					onPress={() => handleSetChange(1)}
					disabled={currentSet === exercise.sets}
				>
					<View>
						<ChevronsRight className="text-secondary-foreground" />
						<Text className="text-center text-secondary-foreground">
							Set
						</Text>
					</View>
				</Button>
			</View>
		</View>
	);
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
