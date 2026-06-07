import { AudioSource, useAudioPlayer } from "expo-audio";
import { useCallback } from "react";

export default function useSound(audioSource: AudioSource, isMuted?: boolean) {
	const player = useAudioPlayer(audioSource);

	const play = useCallback(() => {
		if (isMuted) {
			return;
		}

		player.seekTo(0);
		player.play();
	}, [player, isMuted]);

	return { play };
}
