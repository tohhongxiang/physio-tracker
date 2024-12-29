import { useQuery } from "@tanstack/react-query";
import {
	Link,
	useLocalSearchParams,
	useNavigation,
	useRouter
} from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import getWorkout from "~/api/get-workout";
import { Button } from "~/components/ui/button";
import WorkoutDetails from "~/components/workout-details";
import { Pencil } from "~/lib/icons/Pencil";
import { Trash } from "~/lib/icons/Trash";
import { Text } from "~/components/ui/text";
import useDeleteWorkout from "~/hooks/api/use-delete-workout";
import { useAlertDialog } from "~/providers/alert-dialog-provider";
import WorkoutNotFound from "~/components/workout-not-found";
import { toast } from "sonner-native";
import { workoutQueryKeys } from "~/hooks/api/query-keys";

export default function SpecificWorkOutRoute() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: workout, isPending: isLoadingWorkout } = useQuery({
		queryKey: workoutQueryKeys.detail(parseInt(id)),
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
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
					<Button>
						<Text>Start Exercise</Text>
					</Button>
				</Link>
			</View>
		</View>
	);
}
