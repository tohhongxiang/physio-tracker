import { useMutation, useQueryClient } from "@tanstack/react-query";
import editWorkout from "~/api/edit-workout";
import { Workout } from "~/types";
import { workoutQueryKeys } from "./query-keys";
import useWorkoutFilterParams from "../use-workout-filter-params";

export default function useEditWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Workout) => void;
	onError?: (error: Error) => void;
}) {
	const queryClient = useQueryClient();
	const { filters } = useWorkoutFilterParams();

	const { isPending, mutate, error } = useMutation({
		mutationFn: editWorkout,
		onSuccess: (editedWorkout) => {
			queryClient.setQueryData(
				workoutQueryKeys.list({ ...filters, page: 0 }),
				(oldData?: { count: number; data: Workout[] }) => {
					if (!oldData) return oldData;

					const { count, data: previousWorkouts } = oldData;
					return {
						count,
						data: previousWorkouts.map((workout) =>
							workout.id === editedWorkout.id
								? editedWorkout
								: workout
						)
					};
				}
			);

			queryClient.setQueryData(
				workoutQueryKeys.detail(editedWorkout.id),
				editedWorkout
			);

			queryClient.setQueryData(
				workoutQueryKeys.today(),
				(previousWorkoutToday?: Workout) => {
					if (!previousWorkoutToday) return previousWorkoutToday;
					if (previousWorkoutToday.id !== editedWorkout.id)
						return previousWorkoutToday;

					return editedWorkout;
				}
			);

			onSuccess?.(editedWorkout);
		},
		onError
	});

	return { isLoading: isPending, editWorkout: mutate, error };
}
