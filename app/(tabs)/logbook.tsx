import { startOfMonth } from "date-fns";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import WorkoutCalendar from "~/components/workout-calendar";
import WorkoutLogsList from "~/components/workout-logs";
import { Text } from "~/components/ui/text";
import useGetWorkoutLogsByMonthYear from "~/hooks/api/use-get-workout-logs-by-month-year";

export default function RecentWorkouts() {
	const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
	const { data, isPending } = useGetWorkoutLogsByMonthYear(currentDate);

	return (
		<ScrollView contentContainerClassName="flex flex-col gap-4 p-4">
			<WorkoutCalendar
				currentDate={currentDate}
				onDateChange={setCurrentDate}
			/>
			<View className="flex flex-col">
				<Text className="text-3xl font-bold">
					Your Completed Workouts
				</Text>
				<View className="-mx-4">
					{isPending ? (
						<WorkoutLogsList.Loading />
					) : (
						<WorkoutLogsList logs={data ?? []} />
					)}
				</View>
			</View>
		</ScrollView>
	);
}
