import { useMutation } from "@tanstack/react-query";

import togglePinnedWorkout from "~/api/toggle-pinned-workout";
import { Workout } from "~/types";

export default function useTogglePinnedWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (pinnedWorkout: {
		workoutId: Workout["id"];
		position: number;
	}) => void;
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
