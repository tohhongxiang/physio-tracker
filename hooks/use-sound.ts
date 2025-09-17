import { AudioSource, useAudioPlayer } from "expo-audio";
import { useCallback } from "react";

export default function useSound(audioSource: AudioSource) {
	const player = useAudioPlayer(audioSource);

	const play = useCallback(() => {
		player.seekTo(0);
		player.play();
	}, [player]);

	return { play };
}
