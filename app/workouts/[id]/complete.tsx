import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useCreateWorkoutLog from "~/hooks/api/use-create-workout-log";

export default function CompleteWorkoutPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { createWorkoutLog, isLoading } = useCreateWorkoutLog({
		onSuccess: () => {
			router.push("/");
		},
		onError: (error: Error) =>
			toast.error("Failed to add log: " + error.message)
	});

	function handleMarkAsComplete() {
		createWorkoutLog({ workoutId: parseInt(id), date: new Date() });
	}

	return (
		<View className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
			<Text className="text-center text-4xl font-bold">
				Workout Complete!
			</Text>
			<View className="flex flex-row flex-wrap items-stretch justify-center gap-4">
				<Button
					onPress={handleMarkAsComplete}
					className="w-full"
					disabled={isLoading}
				>
					<Text>
						{isLoading ? "Submitting..." : "Mark as Complete"}
					</Text>
				</Button>
			</View>
		</View>
	);
}
