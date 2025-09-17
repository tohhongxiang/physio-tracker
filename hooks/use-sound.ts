import { AudioSource, useAudioPlayer } from "expo-audio";
import { useCallback, useEffect } from "react";

export default function useSound(audioSource: AudioSource, isMuted?: boolean) {
	const player = useAudioPlayer(audioSource);

	useEffect(() => {
		player.muted = Boolean(isMuted);
	}, [isMuted, player]);

	const play = useCallback(() => {
		if (player.muted) {
			return;
		}

		player.seekTo(0);
		player.play();
	}, [player]);

	return { play };
}
