import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import CompleteWorkoutPage from "./complete";
import { Workout } from "~/types";
import ExerciseStateDisplay from "./exercise-state-display";
import useSound from "~/hooks/use-sound";
import goSound from "~/assets/audio/go.mp3";
import readySound from "~/assets/audio/ready.mp3";
import LoadingWorkoutPage from "./loading";
import WorkoutNotFound from "./not-found";

export default function WorkoutStartPage({ workout }: { workout: Workout }) {
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const { exercises } = workout;

	const goSoundPlayer = useSound(goSound);
	const readySoundPlayer = useSound(readySound);

	if (currentExerciseIndex >= exercises.length) {
		return <CompleteWorkoutPage />;
	}

	const currentExercise = exercises[currentExerciseIndex];
	return (
		<View className="flex flex-1 flex-col items-center justify-between">
			<View className="flex w-full flex-row items-center justify-between p-8">
				<Button
					variant="ghost"
					size="icon"
					disabled={currentExerciseIndex === 0}
					onPress={() => setCurrentExerciseIndex((c) => c - 1)}
				>
					<ChevronLeft className="text-foreground" />
				</Button>
				<Text className="text-center text-2xl font-semibold">
					{currentExercise.name}
				</Text>
				<Button
					variant="ghost"
					size="icon"
					disabled={currentExerciseIndex === exercises.length - 1}
					onPress={() => setCurrentExerciseIndex((c) => c + 1)}
				>
					<ChevronRight className="text-foreground" />
				</Button>
			</View>
			<ExerciseStateDisplay
				exercise={currentExercise}
				key={currentExercise.id} // reset all state when moving to a new exercise
				onExerciseComplete={() => setCurrentExerciseIndex((c) => c + 1)}
				onTimerComplete={() => goSoundPlayer.play()}
				onTimerUpdate={({ remainingTimeMs }) => {
					if (remainingTimeMs < 3000) {
						readySoundPlayer.play();
					}
				}}
			/>
		</View>
	);
}

WorkoutStartPage.Loading = LoadingWorkoutPage;
WorkoutStartPage.NotFound = WorkoutNotFound;