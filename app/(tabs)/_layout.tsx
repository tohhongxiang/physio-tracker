import { Tabs } from "expo-router";
import { ThemeToggle } from "~/components/theme-toggle";
import NavigationHeader from "~/components/navigation-header";
import { Button } from "~/components/ui/button";
import { Dumbbell } from "~/lib/icons/Dumbbell";
import { Home } from "~/lib/icons/Home";
import { ClipboardList } from "~/lib/icons/ClipboardList";
import { Clock } from "~/lib/icons/Clock";
import { Settings } from "~/lib/icons/Settings";

const FOCUSED_ICON_STROKE_WIDTH = 2.3;
const UNFOCUSED_ICON_STROKE_WIDTH = 2;
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
					tabBarIcon: ({ color, size, focused }) => (
						<Home
							color={color}
							size={size}
							strokeWidth={
								focused
									? FOCUSED_ICON_STROKE_WIDTH
									: UNFOCUSED_ICON_STROKE_WIDTH
							}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="workouts"
				options={{
					title: "Workouts",
					headerShown: false,
					tabBarIcon: ({ color, size, focused }) => (
						<Dumbbell
							color={color}
							size={size}
							strokeWidth={
								focused
									? FOCUSED_ICON_STROKE_WIDTH
									: UNFOCUSED_ICON_STROKE_WIDTH
							}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="logbook"
				options={{
					title: "Logbook",
					tabBarIcon: ({ color, size, focused }) => (
						<ClipboardList
							color={color}
							size={size}
							strokeWidth={
								focused
									? FOCUSED_ICON_STROKE_WIDTH
									: UNFOCUSED_ICON_STROKE_WIDTH
							}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="timer"
				options={{
					title: "Timer",
					tabBarIcon: ({ color, size, focused }) => (
						<Clock
							color={color}
							size={size}
							strokeWidth={
								focused
									? FOCUSED_ICON_STROKE_WIDTH
									: UNFOCUSED_ICON_STROKE_WIDTH
							}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="test"
				options={{
					title: "Debug",
					href: __DEV__ ? undefined : null,
					tabBarIcon: ({ color, size, focused }) => (
						<Settings
							color={color}
							size={size}
							strokeWidth={
								focused
									? FOCUSED_ICON_STROKE_WIDTH
									: UNFOCUSED_ICON_STROKE_WIDTH
							}
						/>
					)
				}}
			/>
		</Tabs>
	);
}
