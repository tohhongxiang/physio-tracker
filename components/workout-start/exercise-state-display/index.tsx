import { View } from "react-native";
import { Exercise } from "~/types";
import { Text } from "~/components/ui/text";
import hasDurationPerRep from "~/lib/has-duration-per-rep";
import BottomControls from "../bottom-controls";
import TimerDisplay from "../time-display";
import useExerciseControls, { STATES } from "../use-exercise-controls";
import hasRestBetweenReps from "~/lib/has-rest-between-reps";
import hasRestBetweenSets from "~/lib/has-rest-between-sets";
import CounterContainer from "./counter-container";
import ExerciseRestDetails from "~/components/workout-details/exercise-card/exercise-rest-details";
import ExerciseRepsAndSetsDetails from "~/components/workout-details/exercise-card/exercise-reps-and-sets-details";

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
				<CounterContainer
					exercise={exercise}
					currentRep={currentRep}
					currentSet={currentSet}
				/>
				<View className="mb-8 flex flex-col items-center justify-center gap-4">
					<ExerciseRepsAndSetsDetails
						durationPerRepSeconds={exercise.durationPerRepSeconds}
					/>
					<ExerciseRestDetails
						restBetweenRepsSeconds={exercise.restBetweenRepsSeconds}
						restBetweenSetsSeconds={exercise.restBetweenSetsSeconds}
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
