import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function TimerDisplay({ durationMs }: { durationMs: number }) {
	return (
		<View>
			<Text className="text-7xl font-bold">
				{formatDuration(durationMs)}
			</Text>
		</View>
	);
}

const SECONDS_IN_ONE_MINUTE = 60;
const MILLISECONDS_IN_ONE_SECOND = 1000;
function formatDuration(durationMs: number) {
	const minutes = Math.floor(
		durationMs / (SECONDS_IN_ONE_MINUTE * MILLISECONDS_IN_ONE_SECOND)
	);
	const seconds =
		(durationMs % (SECONDS_IN_ONE_MINUTE * MILLISECONDS_IN_ONE_SECOND)) /
		MILLISECONDS_IN_ONE_SECOND;

	return `${minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 })}:${seconds.toLocaleString("en-US", { minimumIntegerDigits: 2, minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
