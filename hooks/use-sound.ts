import { AudioSource, useAudioPlayer } from "expo-audio";

export default function useSound(audioSource: AudioSource) {
	const player = useAudioPlayer(audioSource);

	function play() {
		player.seekTo(0);
		player.play();
	}

	return { play };
}
