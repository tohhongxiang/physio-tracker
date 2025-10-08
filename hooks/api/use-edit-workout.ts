import { useMutation } from "@tanstack/react-query";

import editWorkout from "~/api/edit-workout";

export default function useEditWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Awaited<ReturnType<typeof editWorkout>>) => void;
	onError?: (error: Error) => void;
}) {
	const { isPending, mutate, error } = useMutation({
		mutationFn: editWorkout,
		onSuccess: async (editedWorkout) => {
			onSuccess?.(editedWorkout);
		},
		onError
	});

	return { isLoading: isPending, editWorkout: mutate, error };
}
