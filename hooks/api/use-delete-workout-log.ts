import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkoutLog } from "~/types";
import { workoutLogQueryKeys } from "./query-keys";
import { deleteWorkoutLog } from "~/api/delete-workout-log";

export default function useDeleteWorkoutLog({
	onSuccess,
	onError
}: {
	onSuccess?: (deletedWorkoutLog: Omit<WorkoutLog, "workout">) => void;
	onError?: (error: Error) => void;
} = {}) {
	const queryClient = useQueryClient();

	const { isPending, mutate, error } = useMutation({
		mutationFn: deleteWorkoutLog,
		onSuccess: async (deletedWorkoutLog) => {
			await queryClient.invalidateQueries({
				queryKey: workoutLogQueryKeys.all
			});

			onSuccess?.(deletedWorkoutLog);
		},
		onError
	});

	return { isLoading: isPending, deleteWorkoutLog: mutate, error };
}
