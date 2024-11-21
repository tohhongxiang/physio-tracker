import { Tabs } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import Ionicons from "@expo/vector-icons/Ionicons";
import NavigationHeader from "~/components/NavigationHeader";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				header: (props) => (
					<NavigationHeader
						title={props.options.title ?? props.route.name}
					/>
				),
				headerRight: () => <ThemeToggle />
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "home-sharp" : "home-outline"}
							color={color}
							size={24}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="workouts"
				options={{
					title: "Workouts",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<Ionicons
							name={"barbell-outline"}
							color={color}
							size={24}
						/>
					),
					href: "/workouts"
				}}
			/>
			<Tabs.Screen
				name="about"
				options={{
					title: "About",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={
								focused
									? "information-circle"
									: "information-circle-outline"
							}
							color={color}
							size={24}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: "Account",
					tabBarIcon: ({ color }) => (
						<Ionicons
							name={"person-circle"}
							color={color}
							size={24}
						/>
					)
				}}
			/>
		</Tabs>
	);
}
