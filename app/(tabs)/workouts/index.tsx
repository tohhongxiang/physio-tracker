import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import getWorkouts from "~/api/getWorkouts";
import WorkoutsList from "~/components/workouts-list";

export default function WorkoutList() {
	const { data, isPending, isRefetching, refetch } = useQuery({
		queryKey: ["workouts"],
		queryFn: getWorkouts
	});

	if (isPending) {
		return <WorkoutsList.Loading />;
	}

	const workouts = data ?? [];
	return (
		<View className="flex flex-1 flex-col">
			<WorkoutsList
				workouts={workouts}
				refreshing={isRefetching}
				onRefresh={refetch}
			/>
		</View>
	);
}
