import { useMutation, useQueryClient } from "@tanstack/react-query";
import createWorkout from "~/api/create-workout";
import { Workout } from "~/types";
import useWorkoutFilterParams from "../use-workout-filter-params";

export default function useCreateWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Workout) => void;
	onError?: (error: Error) => void;
} = {}) {
	const queryClient = useQueryClient();
	const { filters } = useWorkoutFilterParams();

	const { isPending, mutate, error } = useMutation({
		mutationFn: createWorkout,
		onSuccess: (createdWorkout) => {
			queryClient.setQueryData(
				["workouts", { ...filters, page: 0 }],
				({
					count,
					data: previousWorkouts
				}: {
					count: number;
					data: Workout[];
				}) => ({
					count: count + 1,
					data: [createdWorkout, ...previousWorkouts]
				})
			);

			queryClient.setQueryData(
				["workouts", createdWorkout.id],
				createdWorkout
			);

			onSuccess?.(createdWorkout);
		},
		onError
	});

	return { isLoading: isPending, createWorkout: mutate, error };
}
