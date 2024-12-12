import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import ExerciseCard from "~/components/workout-details/exercise-card";
import { Workout } from "~/types";
import LoadingWorkoutDetails from "./loading";
import NotFound from "./not-found";
import NoExercises from "./no-exercises";

export default function WorkoutDetails({
	workout,
	showTitle = false
}: {
	workout: Workout | Omit<Workout, "id">;
	showTitle?: boolean;
}) {
	return (
		<View className="flex h-full w-full max-w-lg flex-1 flex-col gap-2">
			<View className="px-4 py-6">
				{showTitle ? (
					<Text className="text-3xl font-semibold">
						{workout.name}
					</Text>
				) : null}
				<Text className={"text-justify text-muted-foreground"}>
					{workout.description.length > 0
						? workout.description
						: "No description provided..."}
				</Text>
			</View>
			<View className="flex flex-row items-center justify-between px-4">
				<Text className="text-2xl font-bold">
					Exercises ({workout.exercises.length})
				</Text>
			</View>
			<ScrollView contentContainerClassName="flex gap-4 p-4">
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
			</ScrollView>
		</View>
	);
}

WorkoutDetails.Loading = LoadingWorkoutDetails;
WorkoutDetails.NotFound = NotFound;
WorkoutDetails.NoExercises = NoExercises;
