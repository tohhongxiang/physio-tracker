import { useCallback, useEffect, useRef, useState } from "react";

export default function useCountdownTimer({
	durationMs,
	isPlaying = false,
	onTimerComplete,
	onTimerUpdate,
	onTimerRestart,
	onTimerPause,
	onTimerStart,
	updateIntervalMs = 1000,
	key = null
}: {
	durationMs: number;
	isPlaying?: boolean;
	onTimerComplete?: () => unknown;
	onTimerUpdate?: ({
		remainingTimeMs
	}: {
		remainingTimeMs: number;
	}) => unknown;
	onTimerRestart?: () => unknown;
	onTimerStart?: () => unknown;
	onTimerPause?: () => unknown;
	updateIntervalMs?: number;
	key?: number | string | null;
}) {
	const [remainingTimeMs, setRemainingTimeMs] = useState(durationMs);
	useEffect(() => {
		setRemainingTimeMs(durationMs);
	}, [durationMs]);

	const lastAnimationFrameID = useRef<number | null>(null);
	const lastUpdatedTime = useRef<number | null>();
	const cleanUp = useCallback(() => {
		lastUpdatedTime.current = null;
		if (lastAnimationFrameID.current) {
			cancelAnimationFrame(lastAnimationFrameID.current);
			lastAnimationFrameID.current = null;
		}
	}, []);

	const handleTimerUpdate = useCallback((time: number) => {
		if (!lastAnimationFrameID.current || !lastUpdatedTime.current) {
			lastUpdatedTime.current = time;
			lastAnimationFrameID.current =
				requestAnimationFrame(handleTimerUpdate);
			return;
		}

		const deltaTimeMs = time - lastUpdatedTime.current;
		lastUpdatedTime.current = time;

		setRemainingTimeMs((current) => Math.max(0, current - deltaTimeMs));
		lastAnimationFrameID.current = requestAnimationFrame(handleTimerUpdate);
	}, []);

	const handleStartTimer = useCallback(() => {
		onTimerStart?.();

		lastAnimationFrameID.current = requestAnimationFrame(handleTimerUpdate);
	}, [handleTimerUpdate, onTimerStart]);

	const handlePauseTimer = useCallback(() => {
		onTimerPause?.();
	}, [onTimerPause]);

	const handleRestartTimer = useCallback(() => {
		onTimerRestart?.();
		setRemainingTimeMs(durationMs);
	}, [durationMs, onTimerRestart]);

	// handle change in isPlaying
	useEffect(() => {
		if (isPlaying) {
			handleStartTimer();
		} else {
			handlePauseTimer();
		}

		return cleanUp;
	}, [handlePauseTimer, handleStartTimer, isPlaying, cleanUp]);

	// handle when remaining time hits 0
	useEffect(() => {
		if (remainingTimeMs > 0 || !onTimerComplete) {
			return;
		}

		if (durationMs === 0) {
			return;
		}

		onTimerComplete();
		setRemainingTimeMs(durationMs);

		return () => {
			if (isPlaying) {
				// old reference to isPlaying. Since we want to set when !isPlaying, we negate to use the old reference
				setRemainingTimeMs(durationMs); // set time back up when timer stops playing
			}
		};
	}, [remainingTimeMs, durationMs, onTimerComplete, isPlaying, cleanUp]);

	useEffect(() => {
		if (key !== null) {
			handleRestartTimer();
		}
	}, [key, handleRestartTimer]);

	const lastTimeUpdateCounterRef = useRef(-1);
	useEffect(() => {
		const lastTimeUpdateCounter = Math.ceil(
			remainingTimeMs / updateIntervalMs
		);

		if (lastTimeUpdateCounter > lastTimeUpdateCounterRef.current) {
			// if timer increased, do not play onTimerUpdate
			lastTimeUpdateCounterRef.current = lastTimeUpdateCounter;
			return;
		}

		if (
			lastTimeUpdateCounterRef.current !== lastTimeUpdateCounter &&
			remainingTimeMs > 0 // do not call onTimerUpdate if there is no remaining time
		) {
			lastTimeUpdateCounterRef.current = lastTimeUpdateCounter;
			onTimerUpdate?.({ remainingTimeMs });
			return;
		}
	}, [remainingTimeMs, updateIntervalMs, onTimerUpdate]);

	return {
		start: handleStartTimer,
		pause: handlePauseTimer,
		restart: handleRestartTimer,
		remainingTimeMs
	};
}
