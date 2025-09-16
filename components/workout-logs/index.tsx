import { View } from "react-native";

import { WorkoutLog } from "~/types";

import LoadingWorkoutLogs from "./loading";
import NoLogsFound from "./not-found";
import WorkoutLogCard from "./workout-log-card";

export default function WorkoutLogsList({ logs }: { logs: WorkoutLog[] }) {
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
