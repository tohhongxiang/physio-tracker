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
import { workoutQueryKeys } from "~/hooks/api/query-keys";

export default function EditWorkoutModal() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isPending } = useQuery({
		queryKey: workoutQueryKeys.detail(parseInt(id)),
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});

	const router = useRouter();
	const { editWorkout } = useEditWorkout({
		onSuccess: (data) => {
			router.dismissTo(`/workouts/${data.id}`);
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
