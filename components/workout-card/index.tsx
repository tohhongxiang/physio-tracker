import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "../ui/card";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { Link } from "expo-router";
import { View, ViewProps } from "react-native";
import { Workout } from "~/types";
import { Eye } from "~/lib/icons/Eye";
import LoadingWorkoutCard from "./loading";
import WorkoutDurationBadge from "../exercise-detail-badges/workout-duration-badge";
import NumberOfExercisesBadge from "../exercise-detail-badges/number-of-exercises-badge";

interface WorkoutCardProps extends ViewProps {
	workout: Workout;
}

export default function WorkoutCard({ workout, ...props }: WorkoutCardProps) {
	return (
		<Card className="w-full max-w-md" {...props}>
			<CardHeader className="flex w-full flex-row items-center justify-between gap-4">
				<CardTitle className="flex-1" numberOfLines={1}>
					{workout.name}
				</CardTitle>
				<Link
					href={`/workouts/${workout.id}`}
					asChild
					className="shrink-0"
				>
					<Button variant="secondary">
						<Eye size={16} className="text-secondary-foreground" />
					</Button>
				</Link>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{workout.description && (
					<Text className="line-clamp-2 text-lg text-muted-foreground">
						{workout.description}
					</Text>
				)}
				<View className="flex flex-row justify-between">
					<NumberOfExercisesBadge
						number={workout.exercises.length}
						variant="ghost"
						className="px-0"
					/>
					<WorkoutDurationBadge
						workout={workout}
						variant="ghost"
						className="px-0"
					/>
				</View>
			</CardContent>
			<CardFooter>
				<Link href={`/workouts/${workout.id}/start`} asChild>
					<Button
						className="w-full"
						disabled={workout.exercises.length === 0}
					>
						<Text>Start</Text>
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}

WorkoutCard.Loading = LoadingWorkoutCard;
