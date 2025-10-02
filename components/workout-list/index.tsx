import { SearchX } from "lucide-react-native";
import { FlatList, FlatListProps, View } from "react-native";

import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import WorkoutCard from "~/components/workout-card";
import { Workout } from "~/types";

import LoadingWorkoutList from "./loading";

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
export default function WorkoutList({
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
				<View className="flex flex-col items-center justify-center gap-4 py-8">
					<Icon
						as={SearchX}
						className="text-muted-foreground"
						size={64}
					/>
					<Text className="text-center text-lg text-muted-foreground">
						No workouts were found...
					</Text>
				</View>
			}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
		/>
	);
}

WorkoutList.Loading = LoadingWorkoutList;
