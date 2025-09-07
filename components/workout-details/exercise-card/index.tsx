import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { CreateExercise, Exercise } from "~/types";
import ExerciseEffortDetails from "./exercise-effort-details";
import ExerciseRestDetails from "./exercise-rest-details";
import ReadMoreText from "~/components/read-more-text";
import { cn } from "~/lib/utils";

export default function ExerciseCard({
	exercise,
	className,
	actions
}: {
	exercise: Exercise | CreateExercise;
	className?: string;
	actions?: React.ReactNode;
}) {
	return (
		<View
			className={cn(
				"flex flex-col gap-6 rounded-md border border-muted-foreground/30 bg-background p-4",
				className
			)}
		>
			<View>
				<View className="flex w-full flex-row items-center justify-between gap-4">
					<Text className="line-clamp-2 shrink text-xl font-bold">
						{exercise.name}
					</Text>
					{actions}
				</View>
				{exercise.description.length > 0 ? (
					<ReadMoreText
						text={exercise.description}
						className="text-muted-foreground"
					/>
				) : null}
			</View>
			<View className="flex flex-col gap-2">
				<ExerciseEffortDetails
					reps={exercise.reps}
					sets={exercise.sets}
					weight={exercise.weight}
					weightUnit={exercise.weightUnit}
					durationPerRepSeconds={exercise.durationPerRepSeconds}
				/>
				<ExerciseRestDetails
					restBetweenRepsSeconds={exercise.restBetweenRepsSeconds}
					restBetweenSetsSeconds={exercise.restBetweenSetsSeconds}
				/>
			</View>
		</View>
	);
}
