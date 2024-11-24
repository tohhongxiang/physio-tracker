import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import getWorkout from "~/api/getWorkout";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Pencil } from "~/lib/icons/Pencil";
import { Plus } from "~/lib/icons/Plus";
import { Trash } from "~/lib/icons/Trash";
import { DurationExercise, Exercise } from "~/types";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "~/components/ui/dialog";

export default function SpecificWorkOutRoute() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});

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
					<Link href={`/workouts/${id}/edit`} asChild>
						<Button className="flex flex-row gap-2">
							<Plus
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

	return (
		<View className="flex h-full w-full max-w-lg flex-1 flex-col gap-2">
			<View className="px-4 py-6">
				<Text className={"text-justify text-muted-foreground"}>
					{data.description}
				</Text>
			</View>
			<View className="flex flex-row items-center justify-between px-4">
				<Text className="text-2xl font-bold">
					Exercises ({data.exercises.length})
				</Text>
				<View className="flex flex-row gap-2">
					<Link href={`/workouts/${id}/edit`} asChild>
						<Button variant="secondary">
							<Pencil
								size={20}
								className="text-secondary-foreground"
							/>
						</Button>
					</Link>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="destructive"
								className="flex flex-row gap-2"
							>
								<Trash
									size={20}
									className="text-destructive-foreground"
								/>
							</Button>
						</DialogTrigger>
						<DialogContent className="mx-8 sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Delete Workout?</DialogTitle>
								<DialogDescription>
									This action is permanent. You will lose all
									data regarding this workout.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className="flex flex-row justify-end gap-2">
								<DialogClose asChild>
									<Button variant="secondary">
										<Text>Cancel</Text>
									</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button variant="destructive">
										<Text>Delete</Text>
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</View>
			</View>
			<ScrollView contentContainerClassName="flex gap-4 p-4">
				{data.exercises.map((exercise) => (
					<View
						key={exercise.id}
						className="flex flex-col gap-4 rounded-md border border-muted-foreground/30 p-4"
					>
						<Text className="text-xl font-bold">
							{exercise.name}
						</Text>
						<Text className="text-lg text-muted-foreground">
							{exercise.description}
						</Text>
						<View className="flex flex-row">
							<View className="flex flex-row items-center justify-center rounded-md bg-primary px-2 text-center">
								<Text className="text-lg font-semibold text-primary-foreground">
									{exercise.sets}
								</Text>
								<Text className="text-lg text-primary-foreground">
									{" "}
									set(s)
								</Text>
							</View>
							<Text> x </Text>
							<View className="flex flex-row items-center rounded-md bg-primary px-2 text-center">
								<Text className="text-lg font-semibold text-primary-foreground">
									{exercise.repsPerSet}
								</Text>
								<Text className="text-lg text-primary-foreground">
									{" "}
									rep(s)
								</Text>
							</View>
							{hasDuration(exercise) && (
								<>
									<Text> x </Text>
									<View className="flex flex-row items-center rounded-md bg-secondary px-2 text-center">
										<Text className="text-lg font-semibold text-secondary-foreground">
											{formatDuration(
												exercise.durationPerRepSeconds
											)}
										</Text>
										<Text className="text-lg text-secondary-foreground">
											{" "}
											per rep
										</Text>
									</View>
								</>
							)}
						</View>
						{hasDuration(exercise) && (
							<View className="flex flex-row">
								<Text className="text-lg">Rest </Text>
								<View className="flex flex-row items-center rounded-md bg-secondary px-2 text-center">
									<Text className="text-lg font-semibold text-secondary-foreground">
										{formatDuration(
											exercise.restBetweenRepsSeconds
										)}
									</Text>
								</View>
								<Text className="text-lg text-secondary-foreground">
									{" "}
									per rep
								</Text>
							</View>
						)}
					</View>
				))}
			</ScrollView>
			<View className="flex flex-col gap-4 p-4">
				<Link href={`/workouts/${id}/start`} asChild>
					<Button>
						<Text>Start Exercise</Text>
					</Button>
				</Link>
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

const SECONDS_IN_ONE_MINUTE = 60;
function formatDuration(durationSeconds: number) {
	const minutes = Math.floor(durationSeconds / SECONDS_IN_ONE_MINUTE);
	const seconds = durationSeconds % SECONDS_IN_ONE_MINUTE;

	return `${minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 })}:${seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`;
}
