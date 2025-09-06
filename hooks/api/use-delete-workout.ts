import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkout } from "~/api/delete-workout";
import { Workout } from "~/types";
import { workoutLogQueryKeys, workoutQueryKeys } from "./query-keys";

export default function useDeleteWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (deletedWorkout: Omit<Workout, "exercises">) => void;
	onError?: (error: Error) => void;
} = {}) {
	const queryClient = useQueryClient();
	const { isPending, mutate, error } = useMutation({
		mutationFn: deleteWorkout,
		onSuccess: async (deletedWorkout) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: workoutLogQueryKeys.all
				}),
				queryClient.invalidateQueries({
					queryKey: workoutQueryKeys.all
				})
			]);

			onSuccess?.(deletedWorkout);
		},
		onError
	});

	return { isLoading: isPending, deleteWorkout: mutate, error };
}
