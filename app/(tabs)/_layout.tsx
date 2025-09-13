import { Tabs } from "expo-router";
import { ThemeToggle } from "~/components/theme-toggle";
import NavigationHeader from "~/components/navigation-header";
import { Button } from "~/components/ui/button";
import { Dumbbell } from "~/lib/icons/Dumbbell";
import { Home } from "~/lib/icons/Home";
import { ClipboardList } from "~/lib/icons/ClipboardList";
import { Clock } from "~/lib/icons/Clock";
import { Settings } from "~/lib/icons/Settings";

export default function TabLayout() {
	return (
		<Tabs
			backBehavior="history"
			screenOptions={{
				header: (props) => (
					<NavigationHeader
						title={props.options.title ?? props.route.name}
					/>
				),
				headerRight: () => <ThemeToggle />,
				tabBarHideOnKeyboard: true,
				tabBarStyle: {
					height: 64
				},
				animation: "shift",
				tabBarButton: (props) => <Button {...props} variant="ghost" />
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Home color={color} size={size} />
					)
				}}
			/>
			<Tabs.Screen
				name="workouts"
				options={{
					title: "Workouts",
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<Dumbbell color={color} size={size} />
					)
				}}
			/>
			<Tabs.Screen
				name="logbook"
				options={{
					title: "Logbook",
					tabBarIcon: ({ color, size }) => (
						<ClipboardList color={color} size={size} />
					)
				}}
			/>
			<Tabs.Screen
				name="timer"
				options={{
					title: "Timer",
					tabBarIcon: ({ color, size }) => (
						<Clock color={color} size={size} />
					)
				}}
			/>
			<Tabs.Screen
				name="test"
				options={{
					title: "Debug",
					href: __DEV__ ? undefined : null,
					tabBarIcon: ({ color, size }) => (
						<Settings color={color} size={size} />
					)
				}}
			/>
		</Tabs>
	);
}
