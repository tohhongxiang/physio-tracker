import { useMutation, useQueryClient } from "@tanstack/react-query";
import createWorkoutLog from "~/api/create-workout-log";
import { workoutLogQueryKeys, workoutQueryKeys } from "./query-keys";

export default function useCreateWorkoutLog({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Awaited<ReturnType<typeof createWorkoutLog>>) => void;
	onError?: (error: Error) => void;
} = {}) {
	const queryClient = useQueryClient();

	const { isPending, mutate, error } = useMutation({
		mutationFn: createWorkoutLog,
		onSuccess: async (createdWorkoutLog) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: workoutLogQueryKeys.all
				}),
				queryClient.invalidateQueries({
					queryKey: workoutQueryKeys.all
				})
			]);

			onSuccess?.(createdWorkoutLog);
		},
		onError
	});

	return { isLoading: isPending, createWorkoutLog: mutate, error };
}
