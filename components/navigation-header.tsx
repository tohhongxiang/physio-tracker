import { View } from "react-native";
import { Text } from "./ui/text";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { router } from "expo-router";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import Constants from "expo-constants";

export default function NavigationHeader({
	title,
	back,
	headerRight
}: {
	title: string;
	back?: { title?: string; href?: string };
	headerRight?: (props: {
		tintColor?: string;
		canGoBack?: boolean;
	}) => React.ReactNode;
}) {
	return (
		<View
			className="flex flex-row items-center justify-between border-b border-muted-foreground/10 bg-background py-4 pl-4 pr-2"
			style={{ marginTop: Constants.statusBarHeight }}
		>
			<View className="flex flex-row items-center justify-start gap-2">
				{back?.href && (
					<Button
						onPress={() => router.back()}
						variant="ghost"
						size="icon"
					>
						<ArrowLeft
							className="text-foreground"
							size={23}
							strokeWidth={2.5}
						/>
					</Button>
				)}
				<Text className="text-2xl font-bold">{title}</Text>
			</View>
			<View className="flex flex-row items-center justify-end gap-4">
				{headerRight?.({})}
				<ThemeToggle />
			</View>
		</View>
	);
}
