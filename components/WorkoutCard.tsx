import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "./ui/card";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Link } from "expo-router";
import { ViewProps } from "react-native";
import { Workout } from "~/types";
import { Trash } from "~/lib/icons/Trash";

interface WorkoutCardProps extends ViewProps {
	workout: Workout;
}

export default function WorkoutCard({ workout, ...props }: WorkoutCardProps) {
	return (
		<Card className="w-full max-w-md" {...props}>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{workout.name}</CardTitle>
				<Button variant="destructive">
					<Text>
						<Trash
							size={16}
							className="text-destructive-foreground"
						/>
					</Text>
				</Button>
			</CardHeader>
			<CardContent>
				<Text className="text-muted-foreground">
					{workout.exercises.length}{" "}
					{workout.exercises.length === 1 ? "exercise" : "exercises"}
				</Text>
			</CardContent>
			<CardFooter>
				<Link href={`/workout-details/${workout.id}`} asChild>
					<Button className="w-full">
						<Text>Start</Text>
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
