import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkoutLog } from "~/types";
import { workoutLogQueryKeys } from "./query-keys";
import { deleteWorkoutLog } from "~/api/delete-workout-log";
import { getMonth, getYear } from "date-fns";

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
		onSuccess: (deletedWorkoutLog) => {
			const workoutYearCompleted = getYear(deletedWorkoutLog.completedAt);
			const workoutMonthCompleted =
				getMonth(deletedWorkoutLog.completedAt) + 1;

			queryClient.setQueryData(
				workoutLogQueryKeys.month(
					workoutYearCompleted,
					workoutMonthCompleted
				),
				(previousLogs: WorkoutLog[]) =>
					previousLogs.filter(
						(workoutLogs) => workoutLogs.id !== deletedWorkoutLog.id
					)
			);

			queryClient.setQueryData(
				workoutLogQueryKeys.month(
					workoutYearCompleted,
					workoutMonthCompleted,
					true
				),
				(previousLogs: WorkoutLog[]) =>
					previousLogs.filter(
						(workoutLogs) => workoutLogs.id !== deletedWorkoutLog.id
					)
			);

			onSuccess?.(deletedWorkoutLog);
		},
		onError
	});

	return { isLoading: isPending, deleteWorkoutLog: mutate, error };
}
