import { Link } from "expo-router";
import { Eye, Pin, Play } from "lucide-react-native";
import { Pressable, View, ViewProps } from "react-native";
import { toast } from "sonner-native";

import useGetPinnedWorkout from "~/hooks/api/use-get-pinned-workout";
import useTogglePinnedWorkout from "~/hooks/api/use-toggle-pinned-workout";
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
import { Icon } from "../ui/icon";
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
							<Icon
								as={Pin}
								className={cn("text-secondary-foreground")}
								fill={pinnedWorkout ? "currentColor" : "none"}
								size={16}
							/>
						</Button>
						<Link
							href={`/workouts/${workout.id}`}
							asChild
							className="shrink-0"
						>
							<Button variant="ghost">
								<Icon
									as={Eye}
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
								<Icon
									as={Play}
									className="text-primary-foreground h-4 w-4"
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
