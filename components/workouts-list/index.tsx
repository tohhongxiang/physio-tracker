import { FlatList, View } from "react-native";
import WorkoutCard from "~/components/workout-card";
import { Text } from "~/components/ui/text";
import { Workout } from "~/types";
import LoadingWorkoutsList from "./loading";

export default function WorkoutsList({
	workouts = [],
	refreshing,
	onRefresh
}: {
	workouts: Workout[];
	refreshing?: boolean;
	onRefresh?: () => Promise<unknown>;
}) {
	return (
		<FlatList
			className="flex flex-1 flex-col"
			data={workouts}
			key={workouts.length}
			refreshing={refreshing}
			onRefresh={onRefresh}
			ItemSeparatorComponent={() => <View className="p-2" />}
			contentContainerClassName="p-4"
			ListEmptyComponent={() => (
				<Text className="text-center text-lg text-muted-foreground">
					No workouts...
				</Text>
			)}
			renderItem={({ item }) => <WorkoutCard workout={item} />}
			keyExtractor={(item) => item.id.toString()}
		/>
	);
}

WorkoutsList.Loading = LoadingWorkoutsList;
