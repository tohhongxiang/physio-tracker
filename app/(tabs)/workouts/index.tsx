import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { View } from "react-native";
import getWorkouts from "~/api/getWorkouts";
import { Button } from "~/components/ui/button";
import WorkoutsList from "~/components/workouts-list";
import { Text } from "~/components/ui/text";
import { Plus } from "~/lib/icons/Plus";

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
			<View className="p-4">
				<Link href="/(modals)/workouts/add" asChild>
					<Button className="flex flex-row items-center justify-center gap-4">
						<Plus className="text-primary-foreground" />
						<Text>Add Workout</Text>
					</Button>
				</Link>
			</View>
			<WorkoutsList
				workouts={workouts}
				refreshing={isRefetching}
				onRefresh={refetch}
			/>
		</View>
	);
}
