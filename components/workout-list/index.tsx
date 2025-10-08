import { SearchX } from "lucide-react-native";
import { FlatList, FlatListProps, View } from "react-native";

import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import WorkoutCard from "~/components/workout-card";
import { WorkoutWithExercises } from "~/db/dto";

import LoadingWorkoutList from "./loading";

function renderItem({ item }: { item: WorkoutWithExercises }) {
	return <WorkoutCard workout={item} />;
}

function keyExtractor(item: WorkoutWithExercises) {
	return item.id.toString();
}

function itemSeparatorComponent() {
	return <View className="p-2" />;
}

interface WorkoutsListProps
	extends Omit<
		FlatListProps<WorkoutWithExercises>,
		| "data"
		| "key"
		| "ItemSeparatorComponent"
		| "contentContainerClassName"
		| "ListEmptyComponent"
		| "renderItem"
		| "keyExtractor"
	> {
	workouts: WorkoutWithExercises[];
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
