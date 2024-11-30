import { View } from "react-native";
import { Exercise } from "~/types";
import { Text } from "~/components/ui/text";
import hasDuration from "~/lib/has-duration";
import BottomControls from "./bottom-controls";
import CounterDisplay from "./counter-display";
import TimerDisplay from "./time-display";
import useExerciseControls, { STATES } from "./use-exercise-controls";

const STATES_TO_MESSAGE: Record<keyof typeof STATES, string> = {
	[STATES.READY]: "READY",
	[STATES.STARTING]: "STARTING",
	[STATES.RUNNING]: "RUNNING",
	[STATES.RESTING_REP]: "RESTING",
	[STATES.RESTING_SET]: "RESTING"
};

export default function ExerciseStateDisplay({
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
	const {
		state,
		remainingTimeMs,
		currentRep,
		currentSet,
		isTimerRunning,
		changeRep,
		changeSet,
		toggleTimer
	} = useExerciseControls({
		exercise,
		onExerciseComplete,
		onTimerUpdate,
		onTimerComplete
	});

	return (
		<View className="flex flex-1 flex-col justify-between">
			<View className="flex grow items-center justify-center gap-8">
				<TimerDisplay durationMs={remainingTimeMs} />
				<Text className="text-3xl font-light tracking-wider">
					{STATES_TO_MESSAGE[state]}
				</Text>
				<View className="flex w-full flex-row justify-around py-4">
					<CounterDisplay
						title="REPS"
						text={
							hasDuration(exercise)
								? `${currentRep} / ${exercise.repsPerSet}`
								: exercise.repsPerSet.toString()
						}
					/>
					<CounterDisplay
						title="SETS"
						text={`${currentSet} / ${exercise.sets}`}
					/>
				</View>
			</View>
			<BottomControls
				currentRep={currentRep}
				currentSet={currentSet}
				totalReps={exercise.repsPerSet}
				totalSets={exercise.sets}
				isTimerRunning={isTimerRunning}
				onRepChange={changeRep}
				onSetChange={changeSet}
				onStart={toggleTimer}
				repChangeDisabled={!hasDuration(exercise)}
			/>
		</View>
	);
}
