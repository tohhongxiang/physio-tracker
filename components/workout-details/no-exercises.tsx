import { Link } from "expo-router";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Plus } from "~/lib/icons/Plus";

export default function NoExercises({ id }: { id: string }) {
	return (
		<View className="flex h-full w-full flex-1 flex-col gap-4 p-4">
			<View className="flex flex-grow flex-col items-center justify-center gap-2">
				<Text className="text-center text-xl font-semibold">
					No exercises
				</Text>
				<Link href={`/workouts/${id}/edit`} asChild>
					<Button className="flex flex-row gap-2">
						<Plus size={20} className="text-primary-foreground" />
						<Text>Add an Exercise</Text>
					</Button>
				</Link>
			</View>
		</View>
	);
}
