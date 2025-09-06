import { useMutation } from "@tanstack/react-query";
import createWorkoutLog from "~/api/create-workout-log";

export default function useCreateWorkoutLog({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Awaited<ReturnType<typeof createWorkoutLog>>) => void;
	onError?: (error: Error) => void;
} = {}) {
	const { isPending, mutate, error } = useMutation({
		mutationFn: createWorkoutLog,
		onSuccess: (createdWorkoutLog) => {
			onSuccess?.(createdWorkoutLog);
		},
		onError
	});

	return { isLoading: isPending, createWorkoutLog: mutate, error };
}
