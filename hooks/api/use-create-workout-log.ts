import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getMonth, getYear } from "date-fns";
import createWorkoutLog from "~/api/create-workout-log";
import { Workout, WorkoutLog } from "~/types";
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
		onSuccess: (data) => {
			const dateCompleted = new Date(data.completedAt);
			const yearCompleted = getYear(dateCompleted);
			const monthCompleted = getMonth(dateCompleted) + 1;

			queryClient.setQueryData(
				workoutLogQueryKeys.month(yearCompleted, monthCompleted),
				(previousLogs: WorkoutLog[]) => [...previousLogs, data]
			);

			// if completed workout is workout of the day, clear it
			queryClient.setQueryData(
				workoutQueryKeys.today(),
				(previousWorkout: Workout) => {
					if (!previousWorkout) return previousWorkout;
					if (data.workoutId === previousWorkout.id) {
						return null;
					}

					return previousWorkout;
				}
			);

			onSuccess?.(data);
		},
		onError
	});

	return { isLoading: isPending, createWorkoutLog: mutate, error };
}
