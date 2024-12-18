import { useMutation, useQueryClient } from "@tanstack/react-query";
import createWorkout from "~/api/create-workout";
import { Workout } from "~/types";

export default function useCreateWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Workout) => void;
	onError?: (error: Error) => void;
} = {}) {
	const queryClient = useQueryClient();

	const { isPending, mutate, error } = useMutation({
		mutationFn: createWorkout,
		onSuccess: (data) => {
			queryClient.setQueryData(
				["workouts"],
				(previousWorkouts: Workout[]) => [data, ...previousWorkouts]
			);

			queryClient.setQueryData(["workouts", data.id], data);

			onSuccess?.(data);
		},
		onError
	});

	return { isLoading: isPending, createWorkout: mutate, error };
}
