import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";
import getWorkouts from "~/api/getWorkouts";
import ExerciseCard from "~/components/workout-card";
import { Text } from "~/components/ui/text";

export default function Workouts() {
	const { data, isPending, isRefetching, refetch } = useQuery({
		queryKey: ["workouts"],
		queryFn: getWorkouts
	});

	const workouts = data ?? [];
	return (
		<View className="flex flex-1 flex-col">
			{isPending ? (
				<View className="flex flex-row items-center justify-center gap-4 p-8">
					<Text className="font-xl italic text-muted-foreground">
						Loading...
					</Text>
				</View>
			) : (
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
					renderItem={({ item }) => <ExerciseCard workout={item} />}
					keyExtractor={(item) => item.id}
				/>
			)}
		</View>
	);
}
