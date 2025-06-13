import { Workout } from "~/types";
import { View } from "react-native";
import WorkoutDetails from "../workout-details";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

interface ConfirmWorkoutProps {
	workout: Workout;
	onSuccessfulSubmit: () => void;
	onGoToPreviousStep: () => void;
	isSubmitting: boolean;
}

export default function ConfirmWorkout({
	workout,
	onSuccessfulSubmit,
	onGoToPreviousStep,
	isSubmitting
}: ConfirmWorkoutProps) {
	return (
		<View className="h-full">
			<WorkoutDetails workout={workout} showTitle />
			<View className="flex flex-row gap-4 p-4">
				<Button
					variant="secondary"
					className="flex-grow"
					onPress={onGoToPreviousStep}
					disabled={isSubmitting}
				>
					<Text>Previous</Text>
				</Button>
				<Button
					className="flex-grow"
					onPress={onSuccessfulSubmit}
					disabled={isSubmitting}
				>
					<Text>{isSubmitting ? "Loading..." : "Submit"}</Text>
				</Button>
			</View>
		</View>
	);
}
