import { startOfMonth } from "date-fns";
import { useState } from "react";
import { View } from "react-native";
import WorkoutCalendar from "~/components/workout-calendar";

export default function AboutScreen() {
	const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));

	return (
		<View className="p-8">
			<WorkoutCalendar
				currentDate={currentDate}
				onDateChange={setCurrentDate}
			/>
		</View>
	);
}
