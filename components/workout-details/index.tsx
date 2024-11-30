import { Link } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Pencil } from "~/lib/icons/Pencil";
import { Trash } from "~/lib/icons/Trash";
import ExerciseCard from "~/components/workout-details/exercise-card";
import DeleteWorkoutDialog from "./delete-workout-dialog";
import { Workout } from "~/types";
import LoadingWorkoutDetails from "./loading";
import NotFound from "./not-found";
import NoExercises from "./no-exercises";

export default function WorkoutDetails({ workout }: { workout: Workout }) {
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
				<View className="flex flex-row gap-2">
					<Link href={`/workouts/${workout.id}/edit`} asChild>
						<Button variant="secondary">
							<Pencil
								size={20}
								className="text-secondary-foreground"
							/>
						</Button>
					</Link>
					<DeleteWorkoutDialog
						onDeleteConfirm={() => alert("Delete workout")}
					>
						<Button
							variant="destructive"
							className="flex flex-row gap-2"
						>
							<Trash
								size={20}
								className="text-destructive-foreground"
							/>
						</Button>
					</DeleteWorkoutDialog>
				</View>
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
