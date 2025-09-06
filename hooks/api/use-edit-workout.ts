import { useMutation, useQueryClient } from "@tanstack/react-query";
import editWorkout from "~/api/edit-workout";
import { Workout } from "~/types";
import { workoutQueryKeys } from "./query-keys";
import useWorkoutFilterParams from "../use-workout-filter-params";
import usePageParams from "../use-page-params";

export default function useEditWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Workout) => void;
	onError?: (error: Error) => void;
}) {
	const queryClient = useQueryClient();
	const { filters } = useWorkoutFilterParams();
	const { page } = usePageParams();

	const { isPending, mutate, error } = useMutation({
		mutationFn: editWorkout,
		onSuccess: async (editedWorkout) => {
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

			await queryClient.invalidateQueries({
				queryKey: workoutQueryKeys.list({ ...filters, page }),
				exact: true
			});

			onSuccess?.(editedWorkout);
		},
		onError
	});

	return { isLoading: isPending, editWorkout: mutate, error };
}
