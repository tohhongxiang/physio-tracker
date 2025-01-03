import { View } from "react-native";
import { Text } from "../ui/text";
import { Frown } from "~/lib/icons/Frown";

export default function NoLogsFound() {
	return (
		<View className="flex flex-col justify-center gap-4 p-8">
			<Frown size={64} className="mx-auto text-muted-foreground" />
			<Text className="text-center text-xl text-muted-foreground">
				No logs were found.
			</Text>
		</View>
	);
}
