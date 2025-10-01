import { Frown } from "lucide-react-native";
import { View } from "react-native";

import { Icon } from "../ui/icon";
import { Text } from "../ui/text";

export default function NoLogsFound() {
	return (
		<View className="flex flex-col justify-center gap-4 p-8">
			<Icon
				as={Frown}
				size={64}
				className="mx-auto text-muted-foreground"
			/>
			<Text className="text-center text-xl text-muted-foreground">
				No logs were found.
			</Text>
		</View>
	);
}
