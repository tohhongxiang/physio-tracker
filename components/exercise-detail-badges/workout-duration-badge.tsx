import { VariantProps } from "class-variance-authority";
import ExerciseDetailBadge, {
	exerciseDetailBadgeTextVariants,
	exerciseDetailBadgeVariants
} from "./exercise-detail-badge";
import { Workout } from "~/types";
import { Clock } from "~/lib/icons/Clock";
import getEstimatedWorkoutDurationSeconds from "~/lib/get-estimated-workout-duration-seconds";
import formatBigNumber from "~/lib/format-big-number";

export default function WorkoutDurationBadge({
	variant,
	workout,
	className
}: { workout: Workout; className?: string } & VariantProps<
	typeof exerciseDetailBadgeVariants
>) {
	const estimatedWorkoutDurationMinutes = Math.floor(
		getEstimatedWorkoutDurationSeconds(workout) / 60
	);

	return (
		<ExerciseDetailBadge
			variant={variant}
			leftIcon={
				<Clock
					className={exerciseDetailBadgeTextVariants({ variant })}
					size={16}
				/>
			}
			boldedText={formatBigNumber(estimatedWorkoutDurationMinutes)}
			text={estimatedWorkoutDurationMinutes === 1 ? "minute" : "minutes"}
			className={className}
		/>
	);
}
