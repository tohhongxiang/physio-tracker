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
import { ViewProps } from "react-native";
import { Workout } from "~/types";
import { Eye } from "~/lib/icons/Eye";
import LoadingWorkoutCard from "./loading";

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
					<Text className="line-clamp-2 text-muted-foreground">
						{workout.description}
					</Text>
				)}
				<Text className="text-muted-foreground">
					{workout.exercises.length}{" "}
					{workout.exercises.length === 1 ? "exercise" : "exercises"}
				</Text>
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
