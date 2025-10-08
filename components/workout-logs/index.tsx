import { View } from "react-native";

import { WorkoutLogWithWorkout } from "~/db/dto";

import LoadingWorkoutLogs from "./loading";
import NoLogsFound from "./not-found";
import WorkoutLogCard from "./workout-log-card";

export default function WorkoutLogsList({
	logs
}: {
	logs: WorkoutLogWithWorkout[];
}) {
	if (logs.length === 0) {
		return <NoLogsFound />;
	}

	// TODO: Add animations when deleting workout
	return (
		<View className="flex flex-col gap-4 p-4">
			{logs.map((log) => (
				<WorkoutLogCard workoutLog={log} key={log.id} />
			))}
		</View>
	);
}
WorkoutLogsList.Loading = LoadingWorkoutLogs;
