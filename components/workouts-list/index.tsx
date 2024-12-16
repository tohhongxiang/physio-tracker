import { FlatList, View } from "react-native";
import WorkoutCard from "~/components/workout-card";
import { Text } from "~/components/ui/text";
import { Workout } from "~/types";
import LoadingWorkoutsList from "./loading";

function renderItem({ item }: { item: Workout }) {
	return <WorkoutCard workout={item} />;
}

function keyExtractor(item: Workout) {
	return item.id.toString();
}

function itemSeparatorComponent() {
	return <View className="p-2" />;
}
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
			ItemSeparatorComponent={itemSeparatorComponent}
			contentContainerClassName="p-4"
			ListEmptyComponent={
				<Text className="text-center text-lg text-muted-foreground">
					No workouts...
				</Text>
			}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
		/>
	);
}

WorkoutsList.Loading = LoadingWorkoutsList;
