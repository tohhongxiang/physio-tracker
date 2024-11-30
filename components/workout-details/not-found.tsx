import { useNavigation } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function NotFound() {
	const navigation = useNavigation();

	return (
		<View className="flex flex-1 flex-col items-center justify-center gap-8">
			<Text className="text-center text-xl text-muted-foreground">
				No workout found...
			</Text>
			<Button onPress={() => navigation.goBack()}>
				<Text>Go Back</Text>
			</Button>
		</View>
	);
}
