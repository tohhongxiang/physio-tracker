import {
	Link,
	useLocalSearchParams,
	useNavigation,
	useRouter
} from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import WorkoutDetails from "~/components/workout-details";
import WorkoutNotFound from "~/components/workout-not-found";
import useDeleteWorkout from "~/hooks/api/use-delete-workout";
import useGetWorkout from "~/hooks/api/use-get-workout";
import { Pencil } from "~/lib/icons/Pencil";
import { Play } from "~/lib/icons/Play";
import { Trash } from "~/lib/icons/Trash";
import { useAlertDialog } from "~/providers/alert-dialog-provider";

export default function SpecificWorkOutRoute() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: workout, isPending: isLoadingWorkout } = useGetWorkout({
		id: parseInt(id)
	});

	const { deleteWorkout, isLoading: isDeletingWorkout } = useDeleteWorkout({
		onSuccess: () => toast.success("Successfully deleted workout!"),
		onError: (error) => toast.error(error.message)
	});
	const alert = useAlertDialog();
	const router = useRouter();

	const navigation = useNavigation();

	useEffect(() => {
		if (!workout) {
			return;
		}

		navigation.setOptions({
			title: workout.name,
			headerRight: () => (
				<View className="flex flex-row">
					<Link href={`/workouts/${workout.id}/edit`} asChild>
						<Button variant="ghost" size="sm">
							<Pencil className="h-4 w-4 text-secondary-foreground" />
						</Button>
					</Link>
					<Button
						variant="ghost"
						size="sm"
						onPress={() =>
							alert({
								variant: "destructive",
								title: "Delete Workout?",
								description:
									"This action is permanent. You will lose all data regarding this workout.",
								actionText: "Delete",
								loadingText: "Deleting...",
								onConfirm: async () => {
									deleteWorkout(workout.id);
								},
								onSuccess: () => {
									router.push("/(tabs)/workouts");
								}
							})
						}
					>
						<Trash className="h-4 w-4 text-destructive" />
					</Button>
				</View>
			)
		});
	}, [navigation, workout, deleteWorkout, isDeletingWorkout, router, alert]);

	if (isLoadingWorkout) {
		return <WorkoutDetails.Loading />;
	}

	if (!workout) {
		return <WorkoutNotFound />;
	}

	if (workout.exercises.length === 0) {
		return <WorkoutDetails.NoExercises id={id} />;
	}

	return (
		<View className="flex-1">
			<WorkoutDetails workout={workout} />
			<View className="flex flex-col gap-4 p-4">
				<Link href={`/workouts/${workout.id}/start`} asChild>
					<Button className="flex w-full flex-row items-center gap-2">
						<Play className="text-primary-foreground" size={16} />
						<Text>Start Exercise</Text>
					</Button>
				</Link>
			</View>
		</View>
	);
}
