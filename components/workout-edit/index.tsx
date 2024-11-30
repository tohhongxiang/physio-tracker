import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { Save } from "~/lib/icons/Save";
import { Workout } from "~/types";

export default function WorkoutEdit({ workout }: { workout: Workout }) {
	const [value, setValue] = useState(workout);
	const onChangeText = (name: keyof typeof value) => (text: string) => {
		setValue((c) => ({ ...c, [name]: text }));
	};

	return (
		<View className="flex flex-1 flex-col p-4">
			<View className="flex grow flex-col gap-4">
				<View>
					<Label nativeID="workoutName" className="mb-2">
						Name
					</Label>
					<Input
						value={value.name}
						onChangeText={onChangeText("name")}
						aria-labelledby="workoutName"
						placeholder="Name"
					/>
				</View>
				<View>
					<Label nativeID="workoutDescription" className="mb-2">
						Description
					</Label>
					<Textarea
						value={value.description}
						onChangeText={onChangeText("description")}
						aria-labelledby="workoutDescription"
						placeholder="Description"
					/>
				</View>
				<Separator />
				<View>
					<View className="flex flex-row items-center justify-between">
						<Text className="text-lg font-bold">Exercises</Text>
						<Button>
							<Text>+</Text>
						</Button>
					</View>
				</View>
			</View>
			<Button className="flex flex-row gap-4">
				<Save className="text-primary-foreground" />
				<Text>Save Changes</Text>
			</Button>
		</View>
	);
}
