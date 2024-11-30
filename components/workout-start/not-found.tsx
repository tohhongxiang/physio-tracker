import { useNavigation } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function WorkoutNotFound() {
	const navigation = useNavigation();

	return (
		<View className="flex flex-1 items-center justify-center gap-4 p-4">
			<Text className="text-center text-2xl text-muted-foreground">
				No Workout Found...
			</Text>
			<Button onPress={() => navigation.goBack()}>
				<Text>Go Back</Text>
			</Button>
		</View>
	);
}
