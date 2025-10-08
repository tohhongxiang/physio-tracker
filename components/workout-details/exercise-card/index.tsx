import { FieldArrayWithId } from "react-hook-form";
import { View } from "react-native";

import ReadMoreText from "~/components/read-more-text";
import { Text } from "~/components/ui/text";
import { WorkoutFormInput } from "~/components/workout-form/schema";
import { cn } from "~/lib/utils";

import ExerciseEffortDetails from "./exercise-effort-details";
import ExerciseRestDetails from "./exercise-rest-details";

export default function ExerciseCard({
	exercise,
	className,
	actions
}: {
	exercise: FieldArrayWithId<WorkoutFormInput, "exercises", "key">;
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
					<Text
						className="line-clamp-2 shrink text-xl font-bold"
						numberOfLines={2}
					>
						{exercise.name}
					</Text>
					{actions}
				</View>
				{exercise.description &&
				(exercise.description?.length ?? 0) > 0 ? (
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
