import { View } from "react-native";

import WorkoutLogCard from "./workout-log-card";

export default function LoadingWorkoutLogs() {
	return (
		<View className="flex flex-col gap-4 py-8">
			{[...Array(6)].map((_, index) => (
				<WorkoutLogCard.Loading key={index} />
			))}
		</View>
	);
}
