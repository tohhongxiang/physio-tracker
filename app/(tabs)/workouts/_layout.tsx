import { Stack } from "expo-router";
import NavigationHeader from "~/components/navigation-header";

export default function WorkoutsTabLayout() {
	return (
		<Stack
			screenOptions={{
				header: (props) => (
					<NavigationHeader
						title={props.options.title ?? props.route.name}
						back={props.back}
					/>
				)
			}}
		>
			<Stack.Screen
				name="index"
				options={{ title: "Workouts", headerBackVisible: false }}
			/>
		</Stack>
	);
}
