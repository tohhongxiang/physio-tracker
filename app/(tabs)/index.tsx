import { View } from "react-native";
import { Text } from "~/components/ui/text";
import {
	Calendar,
	CalendarTheme,
	toDateId
} from "@marceloterreiro/flash-calendar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getWorkoutsToday from "~/api/getWorkoutsToday";
import WorkoutCard from "~/components/WorkoutCard";

const theme: CalendarTheme = {
	rowMonth: {
		content: {
			fontWeight: 700
		}
	},
	itemWeekName: {
		content: {
			fontWeight: 600,
			fontSize: 16
		}
	}
};

export default function Screen() {
	const [selectedDate, setSelectedDate] = useState(toDateId(new Date()));
	const handleCalendarDayPress = (day: string) => {
		console.log(day);
		setSelectedDate(day);
	};

	const { data, isPending } = useQuery({
		queryKey: ["workouts", "today"],
		queryFn: getWorkoutsToday
	});

	return (
		<View className="flex flex-1 flex-col gap-4 p-8">
			<View className="mb-8">
				<Calendar
					calendarMonthId={selectedDate}
					onCalendarDayPress={handleCalendarDayPress}
					theme={theme}
				/>
			</View>
			<View className="flex flex-col gap-4">
				<Text className="text-3xl font-bold">Workouts for Today</Text>
				{isPending ? (
					<View>
						<Text className="text-center text-lg text-muted-foreground">
							Loading...
						</Text>
					</View>
				) : data ? (
					<View>
						{data.map((workout) => (
							<WorkoutCard workout={workout} key={workout.id} />
						))}
					</View>
				) : (
					<Text className="text-lg text-muted-foreground">
						No workouts today...
					</Text>
				)}
			</View>
		</View>
	);
}
