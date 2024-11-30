import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function CounterDisplay({
	title,
	text
}: {
	title: string;
	text: string;
}) {
	return (
		<View className="flex flex-col items-center justify-center rounded-md bg-secondary px-8 py-4">
			<Text className="text-muted-foreground">{title}</Text>
			<Text className="text-2xl font-semibold">{text}</Text>
		</View>
	);
}
