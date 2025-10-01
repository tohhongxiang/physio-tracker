import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";

export default function NoExercises({ id }: { id: string }) {
	return (
		<View className="flex h-full w-full flex-1 flex-col gap-4 p-4">
			<View className="flex flex-grow flex-col items-center justify-center gap-2">
				<Text className="text-center text-xl font-semibold">
					No exercises
				</Text>
				<Link href={`/workouts/${id}/edit`} asChild>
					<Button className="flex flex-row gap-2">
						<Icon
							as={Plus}
							size={20}
							className="text-primary-foreground"
						/>
						<Text>Add an Exercise</Text>
					</Button>
				</Link>
			</View>
		</View>
	);
}
