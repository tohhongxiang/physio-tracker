import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkout } from "~/api/delete-workout";
import { Workout } from "~/types";
import { toast } from "sonner-native";

export default function useDeleteWorkout() {
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
			toast.success("Successfully deleted workout!");
		}
	});

	return { isLoading: isPending, deleteWorkout: mutate, error };
}
