import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import getWorkout from "~/api/getWorkout";
import { Text } from "~/components/ui/text";
import WorkoutForm from "~/components/workout-form";
import { CreateWorkout } from "~/types";

export default function EditWorkout() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});

	function handleSubmit(data: CreateWorkout) {
		console.log("Edit workout", data);
	}

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

	return <WorkoutForm data={data} onSubmit={handleSubmit} />;
}
