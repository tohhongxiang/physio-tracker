import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { useCountdownTimer } from "~/hooks/use-countdown-timer";
import useSound from "~/hooks/use-sound";
import goSound from "~/assets/audio/go.mp3";
import readySound from "~/assets/audio/ready.mp3";
import { useState } from "react";

export default function AboutScreen() {
	const [isPlaying, setIsPlaying] = useState(false);
	const [newDuration, setNewDuration] = useState(1);

	const goSoundPlayer = useSound(goSound);
	const readySoundPlayer = useSound(readySound);

	const timer = useCountdownTimer({
		durationMs: 10000,
		onTimerComplete: () => {
			goSoundPlayer.play();
			return { shouldRepeat: true };
		},
		onTimerUpdate: ({ remainingTimeMs }) => {
			if (remainingTimeMs <= 3000) {
				readySoundPlayer.play();
			}
		},
		isPlaying
		// onTimerPause: ({ remainingTimeMs }) =>
		// 	alert("Remaining: " + remainingTimeMs)
	});

	return (
		<View>
			<Text>About screen</Text>
			<View className="flex flex-row items-center justify-center">
				<Button onPress={() => setNewDuration((c) => c + 1)}>
					<Text>+</Text>
				</Button>
				<Text>{newDuration} s</Text>
				<Button onPress={() => setNewDuration((c) => c - 1)}>
					<Text>-</Text>
				</Button>
			</View>
			<Text className="text-center text-8xl font-bold">
				{formatDuration(timer.remainingTimeMs)}
			</Text>
			<Button onPress={() => setIsPlaying((c) => !c)}>
				<Text>{isPlaying ? "Pause" : "Start"}</Text>
			</Button>
			<Button variant="secondary" onPress={timer.restart}>
				<Text>Restart</Text>
			</Button>
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
