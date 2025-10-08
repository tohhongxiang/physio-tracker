import { useMutation } from "@tanstack/react-query";

import { deleteWorkoutLog } from "~/api/delete-workout-log";

export default function useDeleteWorkoutLog({
	onSuccess,
	onError
}: {
	onSuccess?: (
		deletedWorkoutLog: Awaited<ReturnType<typeof deleteWorkoutLog>>
	) => void;
	onError?: (error: Error) => void;
} = {}) {
	const { isPending, mutate, error } = useMutation({
		mutationFn: deleteWorkoutLog,
		onSuccess: (deletedWorkoutLog) => {
			onSuccess?.(deletedWorkoutLog);
		},
		onError
	});

	return { isLoading: isPending, deleteWorkoutLog: mutate, error };
}
