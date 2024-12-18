import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getMonth, getYear } from "date-fns";
import addWorkoutLog from "~/api/add-workout-log";

export default function useAddWorkoutLog({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Awaited<ReturnType<typeof addWorkoutLog>>) => void;
	onError?: (error: Error) => void;
} = {}) {
	const queryClient = useQueryClient();

	const { isPending, mutate, error } = useMutation({
		mutationFn: addWorkoutLog,
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

	return { isLoading: isPending, addWorkoutLog: mutate, error };
}
