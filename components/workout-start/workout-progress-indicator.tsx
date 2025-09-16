import { memo } from "react";
import { View } from "react-native";

import { Progress } from "../ui/progress";

export default memo(function WorkoutProgressIndicator({
	totalExercises,
	currentExerciseIndex
}: {
	totalExercises: number;
	currentExerciseIndex: number;
}) {
	return (
		<View className="flex w-full px-4 py-2">
			<Progress
				className="h-2"
				value={(currentExerciseIndex / (totalExercises - 1)) * 100}
			/>
		</View>
	);
});
