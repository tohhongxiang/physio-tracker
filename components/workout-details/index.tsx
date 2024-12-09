import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import ExerciseCard from "~/components/workout-details/exercise-card";
import { Workout } from "~/types";
import LoadingWorkoutDetails from "./loading";
import NotFound from "./not-found";
import NoExercises from "./no-exercises";
import { useEffect } from "react";
import { Pencil } from "~/lib/icons/Pencil";
import DeleteWorkoutDialog from "./delete-workout-dialog";
import { Trash } from "~/lib/icons/Trash";

export default function WorkoutDetails({ workout }: { workout: Workout }) {
	const { id } = useLocalSearchParams<{ id: string }>();
	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
			title: workout.name,
			headerRight: () => (
				<View className="flex flex-row">
					<Link href={`/workouts/${id}/edit`} asChild>
						<Button variant="ghost" size="sm">
							<Pencil className="h-4 w-4 text-secondary-foreground" />
						</Button>
					</Link>
					<DeleteWorkoutDialog
						onDeleteConfirm={() => alert("Delete workout " + id)}
					>
						<Button variant="ghost" size="sm">
							<Trash className="h-4 w-4 text-destructive" />
						</Button>
					</DeleteWorkoutDialog>
				</View>
			)
		});
	}, [id, navigation]);

	return (
		<View className="flex h-full w-full max-w-lg flex-1 flex-col gap-2">
			<View className="px-4 py-6">
				<Text className={"text-justify text-muted-foreground"}>
					{workout.description}
				</Text>
			</View>
			<View className="flex flex-row items-center justify-between px-4">
				<Text className="text-2xl font-bold">
					Exercises ({workout.exercises.length})
				</Text>
			</View>
			<ScrollView contentContainerClassName="flex gap-4 p-4">
				{workout.exercises.map((exercise) => (
					<ExerciseCard exercise={exercise} key={exercise.id} />
				))}
			</ScrollView>
			<View className="flex flex-col gap-4 p-4">
				<Link href={`/workouts/${workout.id}/start`} asChild>
					<Button>
						<Text>Start Exercise</Text>
					</Button>
				</Link>
			</View>
		</View>
	);
}

WorkoutDetails.Loading = LoadingWorkoutDetails;
WorkoutDetails.NotFound = NotFound;
WorkoutDetails.NoExercises = NoExercises;
