import { useQuery } from "@tanstack/react-query";
import { getMonth, getYear, startOfMonth } from "date-fns";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import getWorkoutsDoneByYearMonth from "~/api/get-done-workouts-by-month-year";
import WorkoutCalendar from "~/components/workout-calendar";
import WorkoutLogsList from "~/components/workout-logs";
import { workoutLogQueryKeys } from "~/hooks/api/query-keys";
import { Text } from "~/components/ui/text";

export default function RecentWorkouts() {
	const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
	const { data, isPending } = useQuery({
		queryKey: workoutLogQueryKeys.month(
			getYear(currentDate),
			getMonth(currentDate) + 1,
			true
		),
		queryFn: ({ queryKey }) =>
			getWorkoutsDoneByYearMonth(queryKey[1], queryKey[2], true)
	});

	return (
		<ScrollView contentContainerClassName="flex flex-col gap-4 p-4">
			<WorkoutCalendar
				currentDate={currentDate}
				onDateChange={setCurrentDate}
			/>
			<View className="p-4" />
			<View className="flex flex-col gap-4">
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
