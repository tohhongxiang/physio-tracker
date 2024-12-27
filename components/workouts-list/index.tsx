import { FlatList, FlatListProps, View } from "react-native";
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

interface WorkoutsListProps
	extends Omit<
		FlatListProps<Workout>,
		| "data"
		| "key"
		| "ItemSeparatorComponent"
		| "contentContainerClassName"
		| "ListEmptyComponent"
		| "renderItem"
		| "keyExtractor"
	> {
	workouts: Workout[];
	refreshing?: boolean;
	onRefresh?: () => Promise<unknown>;
}
export default function WorkoutsList({
	workouts = [],
	...props
}: WorkoutsListProps) {
	return (
		<FlatList
			{...props}
			className="flex flex-1 flex-col"
			data={workouts}
			key={workouts.length}
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
