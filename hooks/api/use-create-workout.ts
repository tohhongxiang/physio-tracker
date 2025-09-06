import { useMutation } from "@tanstack/react-query";
import createWorkout from "~/api/create-workout";
import { Workout } from "~/types";

export default function useCreateWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Workout) => void;
	onError?: (error: Error) => void;
} = {}) {
	const { isPending, mutate, error } = useMutation({
		mutationFn: createWorkout,
		onSuccess: (createdWorkout) => {
			onSuccess?.(createdWorkout);
		},
		onError
	});

	return { isLoading: isPending, createWorkout: mutate, error };
}
