import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";
import getWorkouts from "~/api/getWorkouts";
import WorkoutCard from "~/components/workout-card";
import { Text } from "~/components/ui/text";
import LoadingWorkoutList from "./loading";

export default function WorkoutList() {
	const { data, isPending, isRefetching, refetch } = useQuery({
		queryKey: ["workouts"],
		queryFn: getWorkouts
	});

	if (isPending) {
		return <LoadingWorkoutList />;
	}

	const workouts = data ?? [];
	return (
		<View className="flex flex-1 flex-col">
			<FlatList
				className="flex flex-1 flex-col"
				data={workouts}
				key={workouts.length}
				refreshing={isRefetching}
				onRefresh={refetch}
				ItemSeparatorComponent={() => <View className="p-2" />}
				contentContainerClassName="p-4"
				ListEmptyComponent={() => (
					<Text className="text-center text-lg text-muted-foreground">
						No workouts...
					</Text>
				)}
				renderItem={({ item }) => <WorkoutCard workout={item} />}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
}
