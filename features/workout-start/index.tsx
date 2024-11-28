import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import getWorkout from "~/api/getWorkout";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import LoadingWorkoutPage from "./loading";
import EmptyWorkoutPage from "./empty";
import CompleteWorkoutPage from "./complete";
import ExercisePage from "./exercise-page";

export default function WorkoutStartPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});

	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

	useEffect(() => {
		if (!data) return;

		setCurrentExerciseIndex(0);
	}, [data]);

	if (isPending) {
		return <LoadingWorkoutPage />;
	}

	if (!data) {
		return <EmptyWorkoutPage />;
	}

	const { exercises } = data;
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
			<ExercisePage
				exercise={currentExercise}
				key={currentExercise.id}
				onExerciseComplete={() => setCurrentExerciseIndex((c) => c + 1)}
			/>
		</View>
	);
}
