import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkout } from "~/api/delete-workout";
import { Workout } from "~/types";
import useWorkoutFilterParams from "../use-workout-filter-params";
import { workoutQueryKeys } from "./query-keys";

export default function useDeleteWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (deletedId: Workout["id"]) => void;
	onError?: (error: Error) => void;
} = {}) {
	const queryClient = useQueryClient();
	const { filters } = useWorkoutFilterParams();

	const { isPending, mutate, error } = useMutation({
		mutationFn: deleteWorkout,
		onSuccess: (deletedId) => {
			queryClient.setQueryData(
				workoutQueryKeys.list({ ...filters, page: 0 }),
				({
					count,
					data: previousWorkouts
				}: {
					count: number;
					data: Workout[];
				}) => ({
					count: count - 1,
					data: previousWorkouts.filter(
						(workouts) => workouts.id !== deletedId
					)
				})
			);

			queryClient.setQueryData(workoutQueryKeys.detail(deletedId), null);

			onSuccess?.(deletedId);
		},
		onError
	});

	return { isLoading: isPending, deleteWorkout: mutate, error };
}
