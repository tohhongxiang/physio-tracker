import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
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
			style={{ paddingTop: Constants.statusBarHeight }}
			className="bg-card shadow"
		>
			<View className="flex flex-row items-center justify-between py-4 pl-4 pr-2">
				<View className="flex flex-1 flex-row items-center justify-start gap-2">
					{(back?.href || back?.title) && (
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
					<Text className="line-clamp-1 flex-1 text-ellipsis text-2xl font-bold">
						{title}
					</Text>
				</View>
				<View className="flex flex-row items-center justify-end gap-4">
					{headerRight?.({})}
				</View>
			</View>
		</View>
	);
}
