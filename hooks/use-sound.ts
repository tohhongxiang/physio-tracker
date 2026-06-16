import { Asset } from "expo-asset";
import { useAudioPlayer } from "expo-audio";
import { useCallback } from "react";
import { Platform } from "react-native";

export default function useSound(audioSource: number, isMuted?: boolean) {
	// https://github.com/expo/expo/issues/34555#issuecomment-3141001410
	const platform = Platform.OS;
	const getAudioSource = () => {
		if (!__DEV__ && platform === "android") {
			const assetinfo = Asset.fromModule(audioSource);
			const rawPath = assetinfo.localUri?.replace("file://", "");
			if (!rawPath) return;
			return { uri: rawPath };
		}

		return audioSource;
	};

	const player = useAudioPlayer(getAudioSource());

	const play = useCallback(() => {
		if (isMuted) {
			return;
		}

		player.seekTo(0);
		player.play();
	}, [player, isMuted]);

	return { play };
}
