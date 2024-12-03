import { View } from "react-native";
import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";

export default function TimerDisplay({ durationMs }: { durationMs: number }) {
	return (
		<View>
			<Text className="text-7xl font-bold">
				{formatDuration(durationMs, 2)}
			</Text>
		</View>
	);
}
