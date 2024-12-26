import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import getWorkout from "~/api/get-workout";
import { Text } from "~/components/ui/text";
import WorkoutForm from "~/components/workout-form";
import useEditWorkout from "~/hooks/api/use-edit-workout";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import WorkoutNotFound from "~/components/workout-not-found";

export default function EditWorkoutModal() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(parseInt(queryKey[1]))
	});

	const router = useRouter();
	const { editWorkout } = useEditWorkout({
		onSuccess: () => {
			router.push("/(tabs)/workouts");
			toast.success("Successfully updated workout!");
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	if (isPending) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (!data) {
		return <WorkoutNotFound />;
	}

	return (
		<WorkoutForm
			data={data}
			onSubmit={(data) =>
				editWorkout({ id: parseInt(id), workout: data })
			}
		/>
	);
}
