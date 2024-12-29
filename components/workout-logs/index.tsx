import { View } from "react-native";
import { WorkoutLog } from "~/types";
import WorkoutLogCard from "./workout-log-card";
import LoadingWorkoutLogs from "./loading";
import NoLogsFound from "./not-found";

export default function WorkoutLogsList({ logs }: { logs: WorkoutLog[] }) {
	if (logs.length === 0) {
		return <NoLogsFound />;
	}
	return (
		<View className="flex flex-col">
			{logs.map((workoutLog, index) => (
				<WorkoutLogCard
					key={workoutLog.id}
					workoutLog={workoutLog}
					className={
						index < logs.length - 1
							? "border-b border-input"
							: undefined
					}
				/>
			))}
		</View>
	);
}
WorkoutLogsList.Loading = LoadingWorkoutLogs;
