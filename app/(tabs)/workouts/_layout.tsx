import { Stack } from "expo-router";
import NavigationHeader from "~/components/navigation-header";

export default function WorkoutsTabLayout() {
	return (
		<>
			<Stack
				screenOptions={{
					header: (props) => {
						return (
							<NavigationHeader
								title={props.options.title ?? props.route.name}
								back={props.back}
								headerRight={props.options.headerRight}
							/>
						);
					}
				}}
			>
				<Stack.Screen
					name="index"
					options={{
						title: "Workouts",
						headerBackVisible: true,
						headerShadowVisible: true
					}}
				/>
			</Stack>
		</>
	);
}
