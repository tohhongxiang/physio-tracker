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
			<Stack.Screen name="start" options={{ title: "Start" }} />
			<Stack.Screen name="edit" options={{ title: "Edit" }} />
		</Stack>
	);
}
