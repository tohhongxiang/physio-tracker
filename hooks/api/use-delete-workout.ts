import { useMutation } from "@tanstack/react-query";

import { deleteWorkout } from "~/api/delete-workout";

export default function useDeleteWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (
		deletedWorkout: Awaited<ReturnType<typeof deleteWorkout>>
	) => void;
	onError?: (error: Error) => void;
} = {}) {
	const { isPending, mutateAsync, error } = useMutation({
		mutationFn: deleteWorkout,
		onSuccess: (deletedWorkout) => {
			onSuccess?.(deletedWorkout);
		},
		onError
	});

	return { isLoading: isPending, deleteWorkout: mutateAsync, error };
}
