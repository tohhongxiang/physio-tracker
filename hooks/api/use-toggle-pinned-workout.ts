import { useMutation } from "@tanstack/react-query";

import togglePinnedWorkout from "~/api/toggle-pinned-workout";

export default function useTogglePinnedWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (
		pinnedWorkout: Awaited<ReturnType<typeof togglePinnedWorkout>>
	) => void;
	onError?: (error: Error) => void;
} = {}) {
	const { isPending, mutate, error } = useMutation({
		mutationFn: togglePinnedWorkout,
		onSuccess: (pinnedWorkout) => {
			onSuccess?.(pinnedWorkout);
		},
		onError
	});

	return { isLoading: isPending, togglePinnedWorkout: mutate, error };
}
