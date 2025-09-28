import { Stack } from "expo-router";

export default function SettingsTabLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Settings",
					headerBackVisible: false,
					headerShadowVisible: true
				}}
			/>
		</Stack>
	);
}
