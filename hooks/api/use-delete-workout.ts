import { useMutation } from "@tanstack/react-query";

import { deleteWorkout } from "~/api/delete-workout";
import { Workout } from "~/types";

export default function useDeleteWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (deletedWorkout: Omit<Workout, "exercises">) => void;
	onError?: (error: Error) => void;
} = {}) {
	const { isPending, mutate, error } = useMutation({
		mutationFn: deleteWorkout,
		onSuccess: (deletedWorkout) => {
			onSuccess?.(deletedWorkout);
		},
		onError
	});

	return { isLoading: isPending, deleteWorkout: mutate, error };
}
