import { useMutation } from "@tanstack/react-query";
import editWorkout from "~/api/edit-workout";
import { Workout } from "~/types";

export default function useEditWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Workout) => void;
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
