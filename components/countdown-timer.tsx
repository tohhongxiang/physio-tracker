import { View } from "react-native";
import { Text } from "./ui/text";
import formatDuration from "~/lib/format-duration";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useState } from "react";

export default function CountdownTimer({
	durationSeconds,
	isPlaying,
	onTimerComplete
}: {
	durationSeconds: number;
	isPlaying: boolean;
	onTimerComplete?: () => unknown;
}) {
	const [timerKey, setTimerKey] = useState(0);

	function handleTimerComplete() {
		onTimerComplete?.();
		setTimerKey((c) => c + 1);
		return {
			shouldRepeat: false,
			newInitialRemainingTime: durationSeconds
		};
	}

	return (
		<View className="flex w-full flex-col items-center justify-center">
			<CountdownCircleTimer
				duration={durationSeconds}
				isPlaying={isPlaying}
				colors={"#bada55"}
				onComplete={handleTimerComplete}
				key={timerKey}
			>
				{({ remainingTime }) => (
					<Text className="native:mt-2 text-center text-5xl font-bold">
						{formatDuration(remainingTime)}
					</Text>
				)}
			</CountdownCircleTimer>
		</View>
	);
}
