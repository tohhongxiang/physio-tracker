import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import getWorkout from "~/api/get-workout";
import { Text } from "~/components/ui/text";
import WorkoutForm from "~/components/workout-form";
import useEditWorkout from "~/hooks/api/use-edit-workout";

export default function EditWorkout() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(parseInt(queryKey[1]))
	});

	const { editWorkout } = useEditWorkout();

	if (isPending) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (!data) {
		return (
			<View>
				<Text>No data</Text>
			</View>
		);
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
