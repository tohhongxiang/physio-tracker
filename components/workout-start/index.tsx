import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Workout } from "~/types";
import ExerciseStateDisplay from "./exercise-state-display";
import useSound from "~/hooks/use-sound";
import goSound from "~/assets/audio/go.mp3";
import readySound from "~/assets/audio/ready.mp3";
import LoadingWorkoutPage from "./loading";
import { useRouter } from "expo-router";
import { Progress } from "../ui/progress";

export default function WorkoutStartPage({ workout }: { workout: Workout }) {
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const { exercises } = workout;

	const goSoundPlayer = useSound(goSound);
	const readySoundPlayer = useSound(readySound);

	const router = useRouter();
	function handleExerciseComplete() {
		if (currentExerciseIndex === workout.exercises.length - 1) {
			return router.push(`/workouts/${workout.id}/complete`);
		}

		setCurrentExerciseIndex((c) => c + 1);
	}

	const currentExercise = exercises[currentExerciseIndex];
	return (
		<View className="flex flex-1 flex-col items-center justify-between">
			<View className="flex w-full px-4 py-2">
				<Progress
					className="h-2"
					value={
						(currentExerciseIndex / (exercises.length - 1)) * 100
					}
				/>
			</View>
			<View className="flex w-full flex-row items-center justify-between p-8 pt-4">
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
				onExerciseComplete={handleExerciseComplete}
				onTimerComplete={() => goSoundPlayer.play()}
				onTimerUpdate={({ remainingTimeMs, totalDurationMs }) => {
					if (
						remainingTimeMs < Math.min(3000, totalDurationMs - 1000) // make sure readySound and goSound do not play at the same time
					) {
						readySoundPlayer.play();
					}
				}}
			/>
		</View>
	);
}

WorkoutStartPage.Loading = LoadingWorkoutPage;
