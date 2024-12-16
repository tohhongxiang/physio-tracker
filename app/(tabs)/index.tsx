import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import getWorkoutsToday from "~/api/getWorkoutsToday";
import WorkoutCard from "~/components/workout-card";
import WorkoutCalendar from "~/components/workout-calendar";
import { Button } from "~/components/ui/button";
import { PartyPopper } from "~/lib/icons/PartyPopper";
import { Link } from "expo-router";

export default function Screen() {
	const { data, isPending } = useQuery({
		queryKey: ["workouts", "today"],
		queryFn: getWorkoutsToday
	});

	return (
		<View className="flex flex-1 flex-col gap-4 p-8">
			<View className="mb-6">
				<WorkoutCalendar />
			</View>
			<View className="flex flex-col gap-4">
				<Text className="text-3xl font-bold">Today&apos;s Workout</Text>
				{isPending ? (
					<View>
						<WorkoutCard.Loading />
					</View>
				) : data ? (
					<View>
						{data.map((workout) => (
							<WorkoutCard workout={workout} key={workout.id} />
						))}
					</View>
				) : (
					<View className="flex flex-col gap-4 p-4">
						<PartyPopper
							className="mx-auto text-muted-foreground"
							size={48}
						/>
						<Text className="text-center text-lg text-muted-foreground">
							You have no workouts for today!
						</Text>
						<Link href="/(modals)/workouts/add" asChild>
							<Button>
								<Text>Add a new workout</Text>
							</Button>
						</Link>
					</View>
				)}
			</View>
		</View>
	);
}
