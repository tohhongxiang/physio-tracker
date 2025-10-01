import { Link } from "expo-router";
import { ArrowRight, PartyPopper } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import WorkoutCard from "~/components/workout-card";
import useGetTodaysWorkout from "~/hooks/api/use-get-todays-workout";

export default function TodaysWorkout() {
	const { data: todaysWorkout, isPending: isFetchingTodaysWorkout } =
		useGetTodaysWorkout();

	return (
		<View className="flex flex-col gap-4">
			<Text className="text-2xl font-semibold tracking-tight">
				Today&apos;s Workout
			</Text>
			{isFetchingTodaysWorkout ? (
				<View>
					<WorkoutCard.Loading />
				</View>
			) : todaysWorkout ? (
				<View>
					<WorkoutCard workout={todaysWorkout} />
				</View>
			) : (
				<View className="flex flex-col gap-4 justify-center items-center py-8">
					<Icon
						as={PartyPopper}
						className="mx-auto text-muted-foreground"
						size={48}
					/>
					<Text className="text-center text-lg text-muted-foreground">
						You have no workouts for today!
					</Text>
					<Link href="/(tabs)/workouts" asChild>
						<Button className="flex flex-row items-center justify-center gap-2">
							<Text></Text>
							{/* Empty text to keep main text in the center */}
							<Text className="text-center">
								See your other workouts
							</Text>
							<Icon
								as={ArrowRight}
								size={16}
								className="text-primary-foreground"
							/>
						</Button>
					</Link>
				</View>
			)}
		</View>
	);
}
