import { useNavigation } from "expo-router";
import { Frown } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";

import { Text } from "~/components/ui/text";

import { Button } from "../ui/button";
import { Icon } from "../ui/icon";

export default function NotFound({
	title,
	text,
	onBackPress
}: {
	title: string;
	text: string;
	onBackPress?: () => void;
}) {
	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			title,
			headerRight: () => null
		});
	}, [navigation, title]);

	return (
		<View className="flex flex-1 flex-col justify-center gap-4 p-8">
			<Icon
				as={Frown}
				size={64}
				className="mx-auto text-muted-foreground"
			/>
			<Text className="text-center text-xl text-muted-foreground">
				{text}
			</Text>
			<Button onPress={onBackPress ?? (() => navigation.goBack())}>
				<Text>Go Back</Text>
			</Button>
		</View>
	);
}
