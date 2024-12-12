import { View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";

interface TimerDisplayProps extends ViewProps {
	durationMs: number;
}

export default function TimerDisplay({
	durationMs,
	...props
}: TimerDisplayProps) {
	return (
		<View {...props}>
			<Text className="text-7xl font-bold">
				{formatDuration(durationMs, 2)}
			</Text>
		</View>
	);
}
