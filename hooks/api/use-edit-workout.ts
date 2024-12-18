import { useMutation, useQueryClient } from "@tanstack/react-query";
import editWorkout from "~/api/edit-workout";
import { Workout } from "~/types";

export default function useEditWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (data: Workout) => void;
	onError?: (error: Error) => void;
}) {
	const queryClient = useQueryClient();

	const { isPending, mutate, error } = useMutation({
		mutationFn: editWorkout,
		onSuccess: (data) => {
			queryClient.setQueryData(
				["workouts"],
				(previousWorkouts: Workout[]) =>
					previousWorkouts.map((workout) =>
						workout.id === data.id ? data : workout
					)
			);

			queryClient.setQueryData(["workouts", data.id], data);

			onSuccess?.(data);
		},
		onError
	});

	return { isLoading: isPending, editWorkout: mutate, error };
}
