import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function LoadingWorkoutList() {
	return (
		<View className="flex flex-row items-center justify-center gap-4 p-8">
			<Text className="font-xl italic text-muted-foreground">
				Loading...
			</Text>
		</View>
	);
}
