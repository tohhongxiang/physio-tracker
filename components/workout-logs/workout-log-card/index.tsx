import { WorkoutLog } from "~/types";
import { View, ViewProps } from "react-native";
import { Text } from "../../ui/text";
import { Link } from "expo-router";
import { Button } from "../../ui/button";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { cn } from "~/lib/utils";
import Loading from "./loading";

interface WorkoutLogCardProps extends ViewProps {
	workoutLog: WorkoutLog;
}

export default function WorkoutLogCard({
	workoutLog,
	className,
	...props
}: WorkoutLogCardProps) {
	return (
		<Link key={workoutLog.id} href={`/workouts/${workoutLog.workout.id}`}>
			<View
				{...props}
				className={cn(
					"flex flex-row gap-4 rounded-md px-4 py-4",
					className
				)}
			>
				<View>
					<Text className="font-bold">
						{workoutLog.completedAt.toLocaleDateString("en-SG", {
							day: "2-digit",
							month: "short"
						})}
					</Text>
					<Text className="text-muted-foreground">
						{new Intl.DateTimeFormat("en-US", {
							timeStyle: "short"
						}).format(workoutLog.completedAt)}
					</Text>
				</View>
				<Text className="flex-1 font-bold">
					{workoutLog.workout.name}
				</Text>
				<Link href={`/workouts/${workoutLog.workout.id}`} asChild>
					<Button variant="ghost" size="icon" className="self-center">
						<ChevronRight className="text-muted-foreground" />
					</Button>
				</Link>
			</View>
		</Link>
	);
}

WorkoutLogCard.Loading = Loading;
