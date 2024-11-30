import { useRef } from "react";

export default function useExecuteOnce<Params, Return>(
	fn: (args: Params) => Return
) {
	const hasExecutedRef = useRef(false);

	function handleExecute(args: Params) {
		if (hasExecutedRef.current) {
			return null;
		}

		hasExecutedRef.current = true;
		return fn(args);
	}

	function handleReset() {
		hasExecutedRef.current = false;
	}

	return {
		execute: handleExecute,
		reset: handleReset
	};
}
