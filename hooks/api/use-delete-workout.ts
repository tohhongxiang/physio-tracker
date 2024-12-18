import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkout } from "~/api/delete-workout";
import { Workout } from "~/types";

export default function useDeleteWorkout({
	onSuccess,
	onError
}: {
	onSuccess?: (deletedId: Workout["id"]) => void;
	onError?: (error: Error) => void;
} = {}) {
	const queryClient = useQueryClient();

	const { isPending, mutate, error } = useMutation({
		mutationFn: deleteWorkout,
		onSuccess: (deletedId) => {
			queryClient.setQueryData(
				["workouts"],
				(previousWorkouts: Workout[]) =>
					previousWorkouts.filter(
						(workouts) => workouts.id !== deletedId
					)
			);

			queryClient.setQueryData(["workouts", deletedId], null);

			onSuccess?.(deletedId);
		},
		onError
	});

	return { isLoading: isPending, deleteWorkout: mutate, error };
}
