import { memo } from "react";
import { View } from "react-native";

import { Text } from "~/components/ui/text";
import ExerciseEffortDetails from "~/components/workout-details/exercise-card/exercise-effort-details";
import ExerciseRestDetails from "~/components/workout-details/exercise-card/exercise-rest-details";
import hasDurationPerRep from "~/lib/has-duration-per-rep";
import hasRestBetweenReps from "~/lib/has-rest-between-reps";
import hasRestBetweenSets from "~/lib/has-rest-between-sets";
import { Exercise } from "~/types";

import CounterContainer from "./counter-container";
import TimerDisplay from "./timer-display";
import { STATES } from "./use-exercise-controls/constants";

const STATES_TO_MESSAGE: Record<keyof typeof STATES, string> = {
	[STATES.READY]: "READY",
	[STATES.STARTING]: "STARTING",
	[STATES.RUNNING]: "RUNNING",
	[STATES.RESTING_REP]: "RESTING",
	[STATES.RESTING_SET]: "RESTING"
};

export default memo(function ExerciseStateDisplay({
	exercise,
	state,
	currentRep,
	currentSet,
	remainingTimeMs
}: {
	exercise: Exercise;
	state: keyof typeof STATES;
	currentRep: number;
	currentSet: number;
	remainingTimeMs: number;
	isRunning: boolean;
}) {
	return (
		<View className="flex flex-1 flex-col justify-between">
			<View className="mt-28 flex grow items-center justify-start gap-8">
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
					description={exercise.description}
				/>
				<View className="mb-8 flex flex-col items-center justify-center gap-4">
					<ExerciseEffortDetails
						weight={exercise.weight}
						weightUnit={exercise.weightUnit}
						durationPerRepSeconds={exercise.durationPerRepSeconds}
					/>
					<ExerciseRestDetails
						restBetweenRepsSeconds={exercise.restBetweenRepsSeconds}
						restBetweenSetsSeconds={exercise.restBetweenSetsSeconds}
					/>
				</View>
			</View>
		</View>
	);
});
