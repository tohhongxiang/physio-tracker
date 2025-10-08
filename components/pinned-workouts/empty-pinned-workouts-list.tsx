import { Link } from "expo-router";
import { ArrowRight, Pin } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";

export default function EmptyPinnedWorkoutsList() {
	return (
		<View className="flex flex-col gap-4 justify-center items-center py-8">
			<Icon as={Pin} className="text-muted-foreground" size={48} />
			<View className="flex flex-col gap-2 justify-center items-center">
				<Text className="text-lg font-bold">No pinned workouts</Text>
				<Text className="text-muted-foreground">
					Pin your favourite workouts for quick access!
				</Text>
			</View>
			<Link href="/(tabs)/workouts" asChild>
				<Button className="flex flex-row items-center justify-center gap-2">
					<Text className="text-center">Browse workouts</Text>
					<Icon
						as={ArrowRight}
						size={16}
						className="text-primary-foreground"
					/>
				</Button>
			</Link>
		</View>
	);
}
