import { View } from "react-native";
import { Text } from "./ui/text";
import formatDuration from "~/lib/format-duration";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useState } from "react";
import useSound from "~/hooks/use-sound";
import goSound from "~/assets/audio/go.mp3";
import readySound from "~/assets/audio/ready.mp3";

const TIMER_INITIAL_COLOR = "#4ade80";
const TIMER_ALMOST_OVER_COLOR = "#facc15";
const CHANGE_COLOR_TIME_THRESHOLD = 3;

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

	const goSoundPlayer = useSound(goSound);
	const readySoundPlayer = useSound(readySound);
	function handleTimerUpdate(remainingTime: number) {
		if (remainingTime === 0) {
			goSoundPlayer.play();
		} else if (remainingTime <= 3) {
			readySoundPlayer.play();
		}
	}

	return (
		<View className="flex w-full flex-col items-center justify-center">
			<CountdownCircleTimer
				duration={durationSeconds}
				isPlaying={isPlaying}
				colors={[TIMER_INITIAL_COLOR, TIMER_ALMOST_OVER_COLOR]}
				colorsTime={[durationSeconds, CHANGE_COLOR_TIME_THRESHOLD, 0]}
				isSmoothColorTransition={false}
				onComplete={handleTimerComplete}
				onUpdate={handleTimerUpdate}
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
