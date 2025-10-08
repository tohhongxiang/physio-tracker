import { useMutation } from "@tanstack/react-query";

import editPinnedWorkoutPosition from "~/api/edit-pinned-workout-position";

export default function useEditPinnedWorkoutPosition({
	onSuccess,
	onError
}: {
	onSuccess?: (
		data: Awaited<ReturnType<typeof editPinnedWorkoutPosition>>
	) => void;
	onError?: (error: Error) => void;
} = {}) {
	const { isPending, mutate, error } = useMutation({
		mutationFn: editPinnedWorkoutPosition,
		onSuccess: async (editedPinnedWorkout) => {
			onSuccess?.(editedPinnedWorkout);
		},
		onError
	});

	return { isLoading: isPending, editPinnedWorkoutOrder: mutate, error };
}
