import { ScrollView, View } from "react-native";
import { WorkoutLog } from "~/types";
import { Text } from "../ui/text";
import WorkoutLogCard from "./workout-log-card";
import { useMemo } from "react";
import LoadingWorkoutLogs from "./loading";

export default function WorkoutLogsList({ logs }: { logs: WorkoutLog[] }) {
	const workoutLogsByMonth = useMemo(
		() => groupWorkoutsByMonthYear(logs),
		[logs]
	);

	return (
		<ScrollView contentContainerClassName="flex flex-col gap-8">
			{Array.from(workoutLogsByMonth).map(
				([monthYear, completedWorkouts]) => (
					<View key={monthYear}>
						<Text className="bg-secondary px-4 py-2 text-lg font-bold">
							{new Date(monthYear).toLocaleDateString("en-SG", {
								month: "long",
								year: "numeric"
							})}
						</Text>
						<View className="flex flex-col">
							{completedWorkouts.map((workoutLog, index) => (
								<WorkoutLogCard
									key={workoutLog.id}
									workoutLog={workoutLog}
									className={
										index < completedWorkouts.length - 1
											? "border-b border-input"
											: undefined
									}
								/>
							))}
						</View>
					</View>
				)
			)}
		</ScrollView>
	);
}
WorkoutLogsList.Loading = LoadingWorkoutLogs;

function groupWorkoutsByMonthYear(logs: WorkoutLog[]) {
	return logs.reduce(
		(previousValue, currentValue) => {
			const completedYear = currentValue.completedAt.getFullYear();
			const completedMonth = currentValue.completedAt.getMonth() + 1;

			const key = `${completedYear}-${completedMonth}-01`; // adding 01 to easily convert to date
			previousValue.set(key, [
				...(previousValue.get(key) ?? []),
				currentValue
			]);
			return previousValue;
		},
		new Map() as Map<string, WorkoutLog[]>
	);
}
