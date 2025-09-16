import { useRouter } from "expo-router";
import { View } from "react-native";
import { toast } from "sonner-native";

import WorkoutForm from "~/components/workout-form";
import useCreateWorkout from "~/hooks/api/use-create-workout";

export default function AddWorkoutModal() {
	const router = useRouter();

	const { createWorkout } = useCreateWorkout({
		onSuccess: () => {
			router.replace("/(tabs)/workouts");
			toast.success("Successfully created workout!");
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	return (
		<View className="flex-1">
			<WorkoutForm onSubmit={createWorkout} />
		</View>
	);
}
