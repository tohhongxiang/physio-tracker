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

export default function SpecificWorkOutRoute() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(parseInt(queryKey[1]))
	});

	const { deleteWorkout, isLoading } = useDeleteWorkout();
	const alert = useAlertDialog();
	const router = useRouter();

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
									deleteWorkout(data.id);
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
	}, [navigation, data, deleteWorkout, isLoading, router, alert]);

	if (isPending) {
		return <WorkoutDetails.Loading />;
	}

	if (!data) {
		return <WorkoutNotFound />;
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
