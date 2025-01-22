import { VariantProps } from "class-variance-authority";
import ExerciseDetailBadge, {
	exerciseDetailBadgeTextVariants,
	exerciseDetailBadgeVariants
} from "./exercise-detail-badge";
import { Workout } from "~/types";
import { Clock } from "~/lib/icons/Clock";
import getEstimatedWorkoutDurationSeconds from "~/lib/get-estimated-workout-duration-seconds";
import formatBigNumber from "~/lib/format-big-number";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";

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

	const { days, hours, minutes } = convertMinutesToDaysHoursMinutes(
		estimatedWorkoutDurationMinutes
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
			className={className}
		>
			{days > 0 ? (
				<>
					<Text
						className={cn(
							exerciseDetailBadgeTextVariants({ variant }),
							"font-semibold"
						)}
					>
						{formatBigNumber(days)}
					</Text>
					<Text> {days === 1 ? "day" : "days"}</Text>
				</>
			) : null}
			{days > 0 && (hours > 0 || minutes > 0) ? <Text> </Text> : null}
			{hours > 0 ? (
				<>
					<Text
						className={cn(
							exerciseDetailBadgeTextVariants({ variant }),
							"font-semibold"
						)}
					>
						{formatBigNumber(hours)}
					</Text>
					<Text> {hours === 1 ? "hour" : "hours"}</Text>
				</>
			) : null}
			{hours > 0 && minutes > 0 ? <Text> </Text> : null}
			{minutes > 0 ? (
				<>
					<Text
						className={cn(
							exerciseDetailBadgeTextVariants({ variant }),
							"font-semibold"
						)}
					>
						{formatBigNumber(minutes)}
					</Text>
					<Text> {minutes === 1 ? "minute" : "minutes"}</Text>
				</>
			) : null}
		</ExerciseDetailBadge>
	);
}

function convertMinutesToDaysHoursMinutes(minutes: number) {
	const days = Math.floor(minutes / (24 * 60));
	const remainingMinutesAfterDays = minutes % (24 * 60);
	const hours = Math.floor(remainingMinutesAfterDays / 60);
	const remainingMinutes = remainingMinutesAfterDays % 60;

	return { days, hours, minutes: remainingMinutes };
}
