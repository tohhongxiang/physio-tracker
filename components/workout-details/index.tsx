import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import ExerciseCard from "~/components/workout-details/exercise-card";
import { Workout } from "~/types";
import LoadingWorkoutDetails from "./loading";
import NoExercises from "./no-exercises";
import ReadMoreText from "../read-more-text";

export default function WorkoutDetails({
	workout,
	showTitle = false
}: {
	workout: Workout | Omit<Workout, "id">;
	showTitle?: boolean;
}) {
	return (
		<ScrollView className="flex h-full w-full max-w-lg flex-1 flex-col gap-2">
			<View className="p-4">
				{showTitle ? (
					<Text className="text-3xl font-semibold">
						{workout.name}
					</Text>
				) : null}
				<ReadMoreText
					className="text-justify text-muted-foreground"
					text={
						workout.description.length > 0
							? workout.description
							: "No description provided..."
					}
				/>
			</View>
			<View className="flex flex-row items-center justify-between px-4">
				<Text className="text-2xl font-bold">
					Exercises ({workout.exercises.length})
				</Text>
			</View>
			<View className="flex gap-4 p-4">
				{workout.exercises.map(
					(
						exercise,
						index // if exercise has no ID (in create form), use index as key
					) => (
						<ExerciseCard
							exercise={exercise}
							key={exercise.id ?? index}
						/>
					)
				)}
			</View>
		</ScrollView>
	);
}

WorkoutDetails.Loading = LoadingWorkoutDetails;
WorkoutDetails.NoExercises = NoExercises;
