import { Tabs } from "expo-router";
import {
	ClipboardList,
	Clock,
	Dumbbell,
	Home,
	Info,
	Settings
} from "lucide-react-native";

import NavigationHeader from "~/components/navigation-header";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

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
						headerRight={() =>
							props.options.headerRight?.({
								canGoBack: false // Bottom tabs requires a canGoBack, but we don't want our tab header to be able to go back
							})
						}
					/>
				),
				headerRight: () => <ThemeToggle />,
				tabBarHideOnKeyboard: true,
				tabBarStyle: {
					height: 64,
					borderTopWidth: 0
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
						<Icon
							as={Home}
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
						<Icon
							as={Dumbbell}
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
						<Icon
							as={ClipboardList}
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
						<Icon
							as={Clock}
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
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color, size, focused }) => (
						<Icon
							as={Settings}
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
						<Icon
							as={Info}
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
