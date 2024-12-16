import { View } from "react-native";
import { Exercise } from "~/types";
import { Text } from "~/components/ui/text";
import hasDurationPerRep from "~/lib/has-duration-per-rep";
import BottomControls from "./bottom-controls";
import CounterDisplay from "./counter-display";
import TimerDisplay from "./time-display";
import useExerciseControls, { STATES } from "./use-exercise-controls";
import hasRestBetweenReps from "~/lib/has-rest-between-reps";
import hasRestBetweenSets from "~/lib/has-rest-between-sets";

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
				<TimerDisplay
					durationMs={remainingTimeMs}
					className={
						!hasDurationPerRep(exercise) &&
						!hasRestBetweenReps(exercise) &&
						!hasRestBetweenSets(exercise)
							? "opacity-50"
							: ""
					}
				/>
				<Text className="text-3xl font-light tracking-wider">
					{STATES_TO_MESSAGE[state]}
				</Text>
				<View className="flex w-full flex-row flex-wrap justify-around gap-4 py-4">
					<CounterDisplay
						title="REPS"
						text={
							hasDurationPerRep(exercise)
								? `${currentRep} / ${exercise.reps}`
								: exercise.reps.toString()
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
				totalReps={exercise.reps}
				totalSets={exercise.sets}
				isTimerRunning={isTimerRunning}
				onRepChange={changeRep}
				onSetChange={changeSet}
				onStart={toggleTimer}
				repChangeDisabled={!hasDurationPerRep(exercise)}
			/>
		</View>
	);
}
