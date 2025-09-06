import { useMutation, useQueryClient } from "@tanstack/react-query";
import createWorkout from "~/api/create-workout";
import { Workout } from "~/types";
import useWorkoutFilterParams from "../use-workout-filter-params";
import { workoutQueryKeys } from "./query-keys";
import usePageParams from "../use-page-params";

export default function useCreateWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Workout) => void;
	onError?: (error: Error) => void;
} = {}) {
	const queryClient = useQueryClient();
	const { filters } = useWorkoutFilterParams();
	const { page } = usePageParams();

	const { isPending, mutate, error } = useMutation({
		mutationFn: createWorkout,
		onSuccess: async (createdWorkout) => {
			queryClient.setQueryData(
				workoutQueryKeys.detail(createdWorkout.id),
				createdWorkout
			);

			await queryClient.invalidateQueries({
				queryKey: workoutQueryKeys.list({ ...filters, page }),
				exact: true
			});

			onSuccess?.(createdWorkout);
		},
		onError
	});

	return { isLoading: isPending, createWorkout: mutate, error };
}
