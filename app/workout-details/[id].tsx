import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { ScrollView, View } from "react-native";
import getWorkout from "~/api/getWorkout";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Pencil } from "~/lib/icons/Pencil";
import { Plus } from "~/lib/icons/Plus";
import { Trash } from "~/lib/icons/Trash";
import { DurationExercise, Exercise } from "~/types";

export default function SpecificWorkOutRoute() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const navigation = useNavigation();

	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});

	useLayoutEffect(() => {
		if (isPending) {
			navigation.setOptions({ title: "Loading Workout..." });
			return;
		}

		if (!data) {
			navigation.setOptions({ title: "Workout not Found!" });
			return;
		}

		navigation.setOptions({ title: data.name });
	}, [navigation, data]);

	if (isPending) {
		return (
			<View className="p-4">
				<Text>Loading...</Text>
			</View>
		);
	}

	if (!data) {
		return (
			<View className="p-4">
				<Text>No workout found...</Text>
			</View>
		);
	}

	if (data.exercises.length === 0) {
		return (
			<View className="flex h-full w-full flex-1 flex-col gap-4 p-4">
				<View className="flex flex-grow flex-col items-center justify-center gap-2">
					<Text className="text-center text-xl font-semibold">
						No exercises
					</Text>
					<Button className="flex flex-row gap-2">
						<Plus size={20} className="text-primary-foreground" />
						<Text>Add an Exercise</Text>
					</Button>
				</View>
			</View>
		);
	}

	return (
		<View className="flex h-full w-full flex-1 flex-col gap-2">
			<View className="flex flex-row items-center justify-between px-4 pt-4">
				<Text className="text-lg text-muted-foreground">
					{data.exercises.length} exercises
				</Text>
				<View className="flex flex-row gap-2">
					<Button variant="secondary">
						<Pencil
							size={20}
							className="text-secondary-foreground"
						/>
					</Button>
					<Button
						variant="destructive"
						className="flex flex-row gap-2"
					>
						<Trash
							size={20}
							className="text-destructive-foreground"
						/>
					</Button>
				</View>
			</View>
			<ScrollView
				className="flex-grow"
				contentContainerClassName="flex gap-4 p-4"
				horizontal
				centerContent
			>
				{data.exercises.map((exercise) => (
					<View
						key={exercise.id}
						className="rounded-md border border-muted-foreground p-4"
					>
						<Text className="flex-grow font-mono">
							{JSON.stringify(exercise, null, 2)}
						</Text>
						<Text className="font-bold">{exercise.name}</Text>
						<Text className="text-muted-foreground">
							{exercise.description}
						</Text>
						<Text>
							{exercise.sets} sets, {exercise.repsPerSet} per set
							{hasDuration(exercise) && (
								<Text>
									, {exercise.durationPerRepSeconds} seconds
									per rep
								</Text>
							)}
						</Text>
					</View>
				))}
			</ScrollView>
			<View className="flex flex-col gap-4 p-4">
				<Button>
					<Text>Start Exercise</Text>
				</Button>
			</View>
		</View>
	);
}

function hasDuration(exercise: Exercise): exercise is DurationExercise {
	return Object.prototype.hasOwnProperty.call(
		exercise,
		"durationPerRepSeconds"
	);
}
