import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function LoadingWorkoutPage() {
	return (
		<View className="flex-1 items-center justify-center p-4">
			<Text className="text-center text-2xl text-muted-foreground">
				Loading...
			</Text>
		</View>
	);
}