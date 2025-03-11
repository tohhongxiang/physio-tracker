import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import getWorkoutToday from "~/api/get-workout-today";
import WorkoutCard from "~/components/workout-card";
import WorkoutCalendar from "~/components/workout-calendar";
import { Button } from "~/components/ui/button";
import { PartyPopper } from "~/lib/icons/PartyPopper";
import { Link } from "expo-router";
import { useState } from "react";
import { startOfMonth } from "date-fns";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { workoutQueryKeys } from "~/hooks/api/query-keys";

export default function IndexPage() {
	const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));

	const { data: todaysWorkout, isPending: isFetchingTodaysWorkout } =
		useQuery({
			queryKey: workoutQueryKeys.today(),
			queryFn: getWorkoutToday
		});

	return (
		<ScrollView contentContainerClassName="flex flex-col gap-6 p-4">
			<View>
				<WorkoutCalendar
					currentDate={currentDate}
					onDateChange={setCurrentDate}
				/>
			</View>
			<View className="flex flex-col gap-4">
				<Text className="text-3xl font-bold">Today&apos;s Workout</Text>
				{isFetchingTodaysWorkout ? (
					<View>
						<WorkoutCard.Loading />
					</View>
				) : todaysWorkout ? (
					<View>
						<WorkoutCard workout={todaysWorkout} />
					</View>
				) : (
					<View className="mt-8 flex flex-col gap-4 px-4">
						<PartyPopper
							className="mx-auto text-muted-foreground"
							size={48}
						/>
						<Text className="text-center text-lg text-muted-foreground">
							You have no workouts for today!
						</Text>
						<Link href="/(tabs)/workouts" asChild>
							<Button className="flex flex-row items-center justify-between gap-2">
								<Text></Text>
								{/* Empty text to keep main text in the center */}
								<Text className="flex-1 text-center">
									See your other workouts
								</Text>
								<ArrowRight className="text-primary-foreground" />
							</Button>
						</Link>
					</View>
				)}
			</View>
		</ScrollView>
	);
}
