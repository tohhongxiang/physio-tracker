import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import editWorkout from "~/api/edit-workout";
import { Workout } from "~/types";

export default function useEditWorkout() {
	const queryClient = useQueryClient();
	const router = useRouter();

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

			router.push("/(tabs)/workouts");
			toast.success("Successfully updated workout!");
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	return { isLoading: isPending, editWorkout: mutate, error };
}
