import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import getWorkout from "~/api/getWorkout";

export default function Layout() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});

	const baseTitle = isPending
		? "Loading..."
		: (data?.name ?? "No workout found");
	return (
		<Stack>
			<Stack.Screen name="index" options={{ title: baseTitle }} />
			<Stack.Screen name="start" options={{ title: "Start" }} />
			<Stack.Screen name="edit" options={{ title: "Edit" }} />
		</Stack>
	);
}
