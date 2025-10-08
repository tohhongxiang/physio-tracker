import { useMutation } from "@tanstack/react-query";

import editExercise from "~/api/edit-exercise";

export default function useEditExercise({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Awaited<ReturnType<typeof editExercise>>) => void;
	onError?: (error: Error) => void;
}) {
	const { isPending, mutate, error } = useMutation({
		mutationFn: editExercise,
		onSuccess: async (editedExercise) => {
			onSuccess?.(editedExercise);
		},
		onError
	});

	return { isLoading: isPending, editExercise: mutate, error };
}
