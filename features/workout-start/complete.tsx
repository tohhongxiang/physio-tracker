import { Link } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function CompleteWorkoutPage() {
	return (
		<View className="flex flex-1 flex-col items-center justify-center gap-8">
			<Text className="text-center text-4xl font-bold">
				Workout Complete!
			</Text>
			<View className="flex flex-row gap-4">
				<Link href="/" asChild>
					<Button>
						<Text>Back to Homepage</Text>
					</Button>
				</Link>
				<Link href="/workouts" asChild>
					<Button variant="secondary">
						<Text>Back to Workouts</Text>
					</Button>
				</Link>
			</View>
		</View>
	);
}
