import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { toast } from "sonner-native";

import { Text } from "~/components/ui/text";
import WorkoutForm from "~/components/workout-form";
import WorkoutNotFound from "~/components/workout-not-found";
import useEditWorkout from "~/hooks/api/use-edit-workout";
import useGetWorkout from "~/hooks/api/use-get-workout";

export default function EditWorkoutModal() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isPending } = useGetWorkout({ id: parseInt(id) });

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
