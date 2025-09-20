import { startOfMonth } from "date-fns";
import { useState } from "react";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import PinnedWorkouts from "~/components/pinned-workouts";
import TodaysWorkout from "~/components/todays-workout";
import WorkoutCalendar from "~/components/workout-calendar";

export default function IndexPage() {
	const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
	const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

	return (
		<Animated.ScrollView
			contentContainerClassName="flex flex-col gap-6 p-4"
			ref={scrollViewRef}
		>
			<WorkoutCalendar
				currentDate={currentDate}
				onDateChange={setCurrentDate}
			/>
			<TodaysWorkout />
			<PinnedWorkouts scrollableRef={scrollViewRef} />
		</Animated.ScrollView>
	);
}
