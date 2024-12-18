import WorkoutForm from "~/components/workout-form";
import useCreateWorkout from "~/hooks/api/use-create-workout";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";

export default function AddWorkoutModal() {
	const router = useRouter();

	const { createWorkout } = useCreateWorkout({
		onSuccess: () => {
			router.push("/(tabs)/workouts");
			toast.success("Successfully created workout!");
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	return <WorkoutForm onSubmit={createWorkout} />;
}
