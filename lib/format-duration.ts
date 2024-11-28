const SECONDS_IN_ONE_MINUTE = 60;
export default function formatDuration(durationSeconds: number) {
	const minutes = Math.floor(durationSeconds / SECONDS_IN_ONE_MINUTE);
	const seconds = durationSeconds % SECONDS_IN_ONE_MINUTE;

	return `${minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 })}:${seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`;
}
