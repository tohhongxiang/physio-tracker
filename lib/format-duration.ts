const SECONDS_IN_ONE_MINUTE = 60;
const MILLISECONDS_IN_ONE_SECOND = 1000;
export default function formatDuration(durationMs: number, decimalPlaces = 0) {
	const minutes = Math.floor(
		durationMs / (SECONDS_IN_ONE_MINUTE * MILLISECONDS_IN_ONE_SECOND)
	);
	const seconds =
		(durationMs % (SECONDS_IN_ONE_MINUTE * MILLISECONDS_IN_ONE_SECOND)) /
		MILLISECONDS_IN_ONE_SECOND;

	return `${minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 })}:${seconds.toLocaleString("en-US", { minimumIntegerDigits: 2, minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces })}`;
}
