import { AVPlaybackSource, Audio } from "expo-av";
import { useCallback, useEffect, useMemo } from "react";

export default function useSound(
	audioSource: AVPlaybackSource,
	isMuted?: boolean
) {
	const player = useMemo(() => new Audio.Sound(), []);

	useEffect(() => {
		player.loadAsync(audioSource);

		return () => {
			player.unloadAsync();
		};
	}, [audioSource, player]);

	const play = useCallback(async () => {
		if (isMuted) {
			return;
		}

		await player.setPositionAsync(0);
		await player.playAsync();
	}, [player, isMuted]);

	return { play };
}
