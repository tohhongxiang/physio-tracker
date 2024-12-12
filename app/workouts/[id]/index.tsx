import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import getWorkout from "~/api/getWorkout";
import { Button } from "~/components/ui/button";
import WorkoutDetails from "~/components/workout-details";
import DeleteWorkoutDialog from "~/components/workout-details/delete-workout-dialog";
import { Pencil } from "~/lib/icons/Pencil";
import { Trash } from "~/lib/icons/Trash";
import { Text } from "~/components/ui/text";

export default function SpecificWorkOutRoute() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});

	const navigation = useNavigation();
	useEffect(() => {
		if (!data) {
			return;
		}

		navigation.setOptions({
			title: data.name,
			headerRight: () => (
				<View className="flex flex-row">
					<Link href={`/workouts/${data.id}/edit`} asChild>
						<Button variant="ghost" size="sm">
							<Pencil className="h-4 w-4 text-secondary-foreground" />
						</Button>
					</Link>
					<DeleteWorkoutDialog
						onDeleteConfirm={() =>
							alert("Delete workout " + data.id)
						}
					>
						<Button variant="ghost" size="sm">
							<Trash className="h-4 w-4 text-destructive" />
						</Button>
					</DeleteWorkoutDialog>
				</View>
			)
		});
	}, [navigation, data]);

	if (isPending) {
		return <WorkoutDetails.Loading />;
	}

	if (!data) {
		return <WorkoutDetails.NotFound />;
	}

	if (data.exercises.length === 0) {
		return <WorkoutDetails.NoExercises id={id} />;
	}

	return (
		<View className="flex-1">
			<WorkoutDetails workout={data} />
			<View className="flex flex-col gap-4 p-4">
				<Link href={`/workouts/${data.id}/start`} asChild>
					<Button>
						<Text>Start Exercise</Text>
					</Button>
				</Link>
			</View>
		</View>
	);
}
