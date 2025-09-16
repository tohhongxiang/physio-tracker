import { View } from "react-native";

import WorkoutCard from "~/components/workout-card";

export default function LoadingWorkoutsList() {
	return (
		<View className="flex flex-col items-center justify-center gap-4 p-4">
			<WorkoutCard.Loading />
			<WorkoutCard.Loading />
			<WorkoutCard.Loading />
		</View>
	);
}
