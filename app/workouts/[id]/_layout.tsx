import { Stack } from "expo-router";

import NavigationHeader from "~/components/navigation-header";

export default function Layout() {
	return (
		<Stack
			screenOptions={{
				header: (props) => (
					<NavigationHeader
						back={props.back}
						title={props.options.title ?? props.route.name}
						headerRight={props.options.headerRight}
					/>
				)
			}}
		>
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
