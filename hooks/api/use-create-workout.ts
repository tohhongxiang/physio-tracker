import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import createWorkout from "~/api/create-workout";
import { Workout } from "~/types";

export default function useCreateWorkout() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { isPending, mutate, error } = useMutation({
		mutationFn: createWorkout,
		onSuccess: (data) => {
			queryClient.setQueryData(
				["workouts"],
				(previousWorkouts: Workout[]) => [data, ...previousWorkouts]
			);

			queryClient.setQueryData(["workouts", data.id], data);
			router.push("/(tabs)/workouts");
			toast.success("Successfully created workout!");
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	return { isLoading: isPending, createWorkout: mutate, error };
}
