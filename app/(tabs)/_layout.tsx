import { Tabs } from "expo-router";
import { ThemeToggle } from "~/components/theme-toggle";
import Ionicons from "@expo/vector-icons/Ionicons";
import NavigationHeader from "~/components/navigation-header";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				header: (props) => (
					<NavigationHeader
						title={props.options.title ?? props.route.name}
					/>
				),
				headerRight: () => <ThemeToggle />,
				tabBarHideOnKeyboard: true,
				animation: "shift"
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
				name="logbook"
				options={{
					title: "Logbook",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "book" : "book-outline"}
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
					href: null,
					tabBarIcon: ({ color }) => (
						<Ionicons
							name={"person-circle"}
							color={color}
							size={24}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="timer"
				options={{
					title: "Timer",
					tabBarIcon: ({ color }) => (
						<Ionicons name="time-outline" color={color} size={24} />
					)
				}}
			/>
			<Tabs.Screen
				name="test"
				options={{
					title: "Test",
					tabBarIcon: ({ color }) => (
						<Ionicons
							name="flask-outline"
							color={color}
							size={24}
						/>
					)
				}}
			/>
		</Tabs>
	);
}
