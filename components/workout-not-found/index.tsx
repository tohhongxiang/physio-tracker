import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Frown } from "~/lib/icons/Frown";

export default function WorkoutNotFound() {
	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			title: "Workout Not Found!",
			headerRight: () => null
		});
	}, [navigation]);

	return (
		<View className="flex flex-1 flex-col justify-center gap-4 p-8">
			<Frown size={64} className="mx-auto text-muted-foreground" />
			<Text className="text-center text-xl text-muted-foreground">
				This workout was not found.
			</Text>
			<Button onPress={() => navigation.goBack()}>
				<Text>Go Back</Text>
			</Button>
		</View>
	);
}
