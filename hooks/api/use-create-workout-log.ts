import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getMonth, getYear } from "date-fns";
import createWorkoutLog from "~/api/create-workout-log";

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
		onSuccess: (data) => {
			const dateCompleted = new Date(data.completedAt);
			const yearCompleted = getYear(dateCompleted);
			const monthCompleted = getMonth(dateCompleted) + 1;

			queryClient.setQueryData(
				["workout-logs", yearCompleted, monthCompleted],
				(previousLogs: unknown[]) => [...previousLogs, data]
			);

			onSuccess?.(data);
		},
		onError
	});

	return { isLoading: isPending, createWorkoutLog: mutate, error };
}
