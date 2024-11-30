import { useState, useRef, useEffect } from "react";

export function useCountdownTimer({
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
	onTimerComplete?: ({ elapsedTimeMs }: { elapsedTimeMs: number }) => {
		newDurationMs?: number;
		shouldRepeat: boolean;
	};
	onTimerUpdate?: ({
		remainingTimeMs
	}: {
		remainingTimeMs: number;
	}) => unknown;
	onTimerRestart?: () => unknown;
	onTimerStart?: () => unknown;
	onTimerPause?: ({
		remainingTimeMs
	}: {
		remainingTimeMs: number;
	}) => unknown;
	updateIntervalMs?: number;
	key?: number | string | null;
}) {
	const [remainingTimeMs, setRemainingTimeMs] = useState(durationMs);

	const lastTimeRef = useRef<number | null>(null);
	const lastAnimationFrameID = useRef<number | null>(null);
	function handleUpdateTimer(time: number) {
		if (lastTimeRef.current === null) {
			lastTimeRef.current = time;
			lastAnimationFrameID.current =
				requestAnimationFrame(handleUpdateTimer);
			return;
		}

		const deltaMs = time - lastTimeRef.current;
		lastTimeRef.current = time;

		setRemainingTimeMs((remainingTimeMs) => {
			const newRemainingTime = remainingTimeMs - deltaMs;

			if (newRemainingTime <= 0) {
				return 0;
			}

			return newRemainingTime;
		});

		lastAnimationFrameID.current = requestAnimationFrame(handleUpdateTimer);
	}

	const lastTimeUpdateCounterRef = useRef(-1);
	useEffect(() => {
		const lastTimeUpdateCounter = Math.ceil(
			remainingTimeMs / updateIntervalMs
		);

		if (
			lastTimeUpdateCounterRef.current !== lastTimeUpdateCounter &&
			remainingTimeMs > 0 // do not call onTimerUpdate if there is no remaining time
		) {
			lastTimeUpdateCounterRef.current = lastTimeUpdateCounter;
			onTimerUpdate?.({ remainingTimeMs });
			return;
		}

		if (remainingTimeMs <= 0 && onTimerComplete) {
			const { newDurationMs, shouldRepeat } = onTimerComplete({
				elapsedTimeMs: durationMs
			});

			const newDurationToSetMs = newDurationMs ?? durationMs;
			if (!shouldRepeat) {
				setTimeout(() => setRemainingTimeMs(newDurationToSetMs), 0);
			} else {
				setRemainingTimeMs(newDurationToSetMs);
			}
		}
	}, [remainingTimeMs]);

	useEffect(() => {
		setRemainingTimeMs(durationMs);
	}, [durationMs]);

	useEffect(() => {
		if (isPlaying) {
			handleStartTimer();
		} else {
			handlePauseTimer();
		}
	}, [isPlaying]);

	function handleStartTimer() {
		onTimerStart?.();

		if (remainingTimeMs > 0) {
			requestAnimationFrame(handleUpdateTimer);
		} else {
			onTimerComplete?.({ elapsedTimeMs: remainingTimeMs });
		}
	}

	function clearTimerInterval() {
		if (isPlaying) {
			return;
		}

		if (lastAnimationFrameID.current) {
			cancelAnimationFrame(lastAnimationFrameID.current);
			lastAnimationFrameID.current = null;
		}

		lastTimeRef.current = null;
	}

	function handlePauseTimer() {
		clearTimerInterval();
		onTimerPause?.({ remainingTimeMs });
	}

	function handleRestartTimer() {
		clearTimerInterval();
		setRemainingTimeMs(durationMs);
		onTimerRestart?.();
	}

	useEffect(() => {
		if (key !== null) {
			handleRestartTimer();
		}
	}, [key]);

	return {
		isRunning: Boolean(lastAnimationFrameID.current),
		start: handleStartTimer,
		pause: handlePauseTimer,
		restart: handleRestartTimer,
		remainingTimeMs
	};
}
