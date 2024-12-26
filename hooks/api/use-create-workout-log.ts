import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getMonth, getYear } from "date-fns";
import createWorkoutLog from "~/api/create-workout-log";
import { Workout, WorkoutLog } from "~/types";

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
				(previousLogs: WorkoutLog[]) => [...previousLogs, data]
			);

			// if completed workout is workout of the day, clear it
			queryClient.setQueryData(
				["workouts", "today"],
				(previousWorkout: Workout) =>
					data.workoutId === previousWorkout.id
						? null
						: previousWorkout
			);

			onSuccess?.(data);
		},
		onError
	});

	return { isLoading: isPending, createWorkoutLog: mutate, error };
}