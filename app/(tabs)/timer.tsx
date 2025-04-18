import { TouchableWithoutFeedback, View } from "react-native";
import useSound from "~/hooks/use-sound";
import goSound from "~/assets/audio/go.mp3";
import readySound from "~/assets/audio/ready.mp3";
import useCountdownTimer from "~/hooks/use-countdown-timer";
import { useCallback, useState } from "react";
import TimerDisplay from "~/components/workout-start/timer-display";
import { Button } from "~/components/ui/button";
import { Play } from "~/lib/icons/Play";
import { Pause } from "~/lib/icons/Pause";
import CounterDisplay from "~/components/workout-start/counter-display";
import { RotateCcw } from "~/lib/icons/RotateCcw";
import { useFocusEffect } from "expo-router";
import TimerInput from "~/components/timer-input";

export default function TimerPage() {
	const [durationSeconds, setDurationSeconds] = useState(10);
	const [isPlaying, setIsPlaying] = useState(false);
	const [laps, setLaps] = useState(0);
	const goSoundPlayer = useSound(goSound);
	const readySoundPlayer = useSound(readySound);

	useFocusEffect(
		useCallback(() => {
			return () => setIsPlaying(false);
		}, [])
	);

	const timer = useCountdownTimer({
		durationMs: durationSeconds * 1000,
		onTimerComplete: () => {
			goSoundPlayer.play();
			setLaps((c) => c + 1);
			return { shouldRepeat: true };
		},
		onTimerUpdate: ({ remainingTimeMs }) => {
			if (remainingTimeMs <= 3000) {
				readySoundPlayer.play();
			}
		},
		isPlaying
	});

	function handleReset() {
		setIsPlaying(false);
		timer.restart();

		setLaps(0);
	}

	function handleTimerInputConfirm(newDurationSeconds: number) {
		if (newDurationSeconds !== durationSeconds) {
			setIsPlaying(false);
			setLaps(0);
		}

		setDurationSeconds(newDurationSeconds);
	}

	return (
		<View className="flex flex-1 flex-col items-center justify-center gap-8">
			<TimerInput
				value={durationSeconds}
				onConfirm={handleTimerInputConfirm}
			>
				<TouchableWithoutFeedback>
					<TimerDisplay durationMs={timer.remainingTimeMs} />
				</TouchableWithoutFeedback>
			</TimerInput>
			<CounterDisplay title="Laps" text={laps.toString()} />
			<View className="flex flex-row items-center justify-center gap-2">
				<Button
					className="native:h-16 native:w-16"
					onPress={() => setIsPlaying((c) => !c)}
				>
					{isPlaying ? (
						<Pause className="text-primary-foreground" />
					) : (
						<Play className="text-primary-foreground" />
					)}
				</Button>
				<Button
					className="native:h-16 native:w-16"
					variant="secondary"
					onPress={handleReset}
				>
					<RotateCcw className="text-secondary-foreground" />
				</Button>
			</View>
		</View>
	);
}
