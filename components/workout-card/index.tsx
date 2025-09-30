import { Link } from "expo-router";
import { Pressable, View, ViewProps } from "react-native";
import { toast } from "sonner-native";

import useGetPinnedWorkout from "~/hooks/api/use-get-pinned-workout";
import useTogglePinnedWorkout from "~/hooks/api/use-toggle-pinned-workout";
import { Eye } from "~/lib/icons/Eye";
import { Pin } from "~/lib/icons/Pin";
import { Play } from "~/lib/icons/Play";
import { cn } from "~/lib/utils";
import { Workout } from "~/types";

import NumberOfExercisesBadge from "../exercise-detail-badges/number-of-exercises-badge";
import WorkoutDurationBadge from "../exercise-detail-badges/workout-duration-badge";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "../ui/card";
import { Text } from "../ui/text";
import LoadingWorkoutCard from "./loading";

interface WorkoutCardProps extends ViewProps {
	workout: Workout;
}

export default function WorkoutCard({ workout, ...props }: WorkoutCardProps) {
	const { isLoading: isPinningWorkout, togglePinnedWorkout } =
		useTogglePinnedWorkout({
			onError: (error) => toast.error(error.message)
		});

	const { isLoading: isFetchingPinnedWorkout, data: pinnedWorkout } =
		useGetPinnedWorkout({ id: workout.id });

	return (
		<Link href={`/workouts/${workout.id}`} asChild>
			<Pressable className="acitve:opacity-80">
				<Card
					{...props}
					className={cn(
						"w-full max-w-md bg-background",
						props.className
					)}
				>
					<CardHeader className="flex w-full flex-row items-center justify-between gap-4 mb-0">
						<View className="flex flex-1 flex-col gap-2">
							<CardTitle numberOfLines={1}>
								{workout.name}
							</CardTitle>
						</View>
						<Button
							variant="ghost"
							disabled={
								isPinningWorkout || isFetchingPinnedWorkout
							}
							onPress={() => togglePinnedWorkout(workout.id)}
						>
							<Pin
								size={16}
								className={cn(
									"stroke-secondary-foreground",
									pinnedWorkout && "fill-secondary-foreground"
								)}
							/>
						</Button>
						<Link
							href={`/workouts/${workout.id}`}
							asChild
							className="shrink-0"
						>
							<Button variant="ghost">
								<Eye
									size={16}
									className="text-secondary-foreground"
								/>
							</Button>
						</Link>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{workout.description && (
							<CardDescription
								className="line-clamp-2 text-ellipsis"
								numberOfLines={2}
							>
								{workout.description}
							</CardDescription>
						)}
						<View className="flex flex-row justify-start gap-4">
							<NumberOfExercisesBadge
								number={workout.exercises.length}
								variant="ghost"
								className="px-0 opacity-75"
							/>
							<WorkoutDurationBadge
								workout={workout}
								variant="ghost"
								className="px-0 opacity-75"
							/>
						</View>
					</CardContent>
					<CardFooter>
						<Link href={`/workouts/${workout.id}/start`} asChild>
							<Button
								className="flex w-full flex-row items-center gap-2"
								disabled={workout.exercises.length === 0}
							>
								<Play
									className="text-primary-foreground"
									size={16}
								/>
								<Text>Start</Text>
							</Button>
						</Link>
					</CardFooter>
				</Card>
			</Pressable>
		</Link>
	);
}

WorkoutCard.Loading = LoadingWorkoutCard;
