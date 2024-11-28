import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import getWorkout from "~/api/getWorkout";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Pencil } from "~/lib/icons/Pencil";
import { Trash } from "~/lib/icons/Trash";
import LoadingWorkoutDetails from "~/features/workout-details/loading";
import ExerciseCard from "~/features/workout-details/exercise-card";
import NotFound from "~/features/workout-details/not-found";
import NoExercises from "~/features/workout-details/no-exercises";
import DeleteWorkoutDialog from "./delete-workout-dialog";

export default function WorkoutDetails() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});

	if (isPending) {
		return <LoadingWorkoutDetails />;
	}

	if (!data) {
		return <NotFound />;
	}

	if (data.exercises.length === 0) {
		return <NoExercises id={id} />;
	}

	return (
		<View className="flex h-full w-full max-w-lg flex-1 flex-col gap-2">
			<View className="px-4 py-6">
				<Text className={"text-justify text-muted-foreground"}>
					{data.description}
				</Text>
			</View>
			<View className="flex flex-row items-center justify-between px-4">
				<Text className="text-2xl font-bold">
					Exercises ({data.exercises.length})
				</Text>
				<View className="flex flex-row gap-2">
					<Link href={`/workouts/${id}/edit`} asChild>
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
				{data.exercises.map((exercise) => (
					<ExerciseCard exercise={exercise} key={exercise.id} />
				))}
			</ScrollView>
			<View className="flex flex-col gap-4 p-4">
				<Link href={`/workouts/${id}/start`} asChild>
					<Button>
						<Text>Start Exercise</Text>
					</Button>
				</Link>
			</View>
		</View>
	);
}
