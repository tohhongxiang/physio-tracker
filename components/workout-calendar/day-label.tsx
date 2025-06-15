import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function DayLabel({ date }: { date: Date }) {
	return (
		<View className="flex flex-1 items-center justify-center">
			<Text className="text-muted-foreground">
				{
					date.toLocaleDateString("default", {
						weekday: "short"
					})[0]
				}
			</Text>
		</View>
	);
}
