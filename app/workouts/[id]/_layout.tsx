import { Stack } from "expo-router";

export default function Layout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Loading..."
				}}
			/>
			<Stack.Screen
				name="start"
				options={{
					title: "Start"
				}}
			/>
			<Stack.Screen
				name="edit"
				options={{ title: "Edit", presentation: "modal" }}
			/>
			<Stack.Screen
				name="exercises/[exercise_id]/edit"
				options={{ title: "Edit Exercise", presentation: "modal" }}
			/>
			<Stack.Screen
				name="complete"
				options={{ title: "Workout Complete!", presentation: "modal" }}
			/>
		</Stack>
	);
}
