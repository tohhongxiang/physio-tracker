import { Link, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { ClipboardCheck } from "~/lib/icons/ClipboardCheck";

export default function Layout() {
	const { id } = useLocalSearchParams<{ id: string }>();

	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Loading..."
				}}
			/>
			<Stack.Screen
				name="start"
				options={{
					title: "Start",
					headerRight: () => (
						<View className="flex flex-row items-center justify-center">
							<Link href={`/workouts/${id}/complete`} asChild>
								<Button
									variant="ghost"
									className="flex flex-row gap-2"
								>
									<ClipboardCheck className="text-primary" />
								</Button>
							</Link>
						</View>
					)
				}}
			/>
			<Stack.Screen name="edit" options={{ title: "Edit" }} />
			<Stack.Screen
				name="complete"
				options={{ title: "Workout Complete!", presentation: "modal" }}
			/>
		</Stack>
	);
}
