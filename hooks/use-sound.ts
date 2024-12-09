import { AudioSource, useAudioPlayer } from "expo-audio";

export default function useSound(audioSource: AudioSource) {
	const player = useAudioPlayer(audioSource);

	async function play() {
		await player.seekTo(0);
		player.play();
	}

	return { play };
}
