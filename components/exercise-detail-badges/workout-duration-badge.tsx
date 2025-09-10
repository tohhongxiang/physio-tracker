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
	size,
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

	const textClassNames = exerciseDetailBadgeTextVariants({
		variant,
		size
	});
	const iconSize = size === "small" ? 12 : 16;

	return (
		<ExerciseDetailBadge
			variant={variant}
			size={size}
			leftIcon={
				<Clock
					className={exerciseDetailBadgeTextVariants({
						variant,
						size
					})}
					size={iconSize}
				/>
			}
			className={className}
		>
			<Content {...{ days, hours, minutes, className: textClassNames }} />
		</ExerciseDetailBadge>
	);
}

function Content({
	days,
	hours,
	minutes,
	className
}: {
	days: number;
	hours: number;
	minutes: number;
	className?: string;
}) {
	if (days > 0) {
		return (
			<>
				<Text className={cn(className, "font-semibold")}>
					{formatBigNumber(days)}
				</Text>
				<Text> {days === 1 ? "day" : "days"}</Text>
			</>
		);
	}

	return (
		<>
			{hours > 0 ? (
				<>
					<Text className={cn(className, "font-semibold")}>
						{formatBigNumber(hours)}
					</Text>
					<Text> {hours === 1 ? "hour" : "hours"}</Text>
				</>
			) : null}
			{hours > 0 && minutes > 0 ? <Text> </Text> : null}
			{minutes > 0 ? (
				<>
					<Text className={cn(className, "font-semibold")}>
						{formatBigNumber(minutes)}{" "}
					</Text>
					<Text className={className}>
						{minutes === 1 ? "minute" : "minutes"}
					</Text>
				</>
			) : null}
		</>
	);
}

function convertMinutesToDaysHoursMinutes(minutes: number) {
	const days = Math.floor(minutes / (24 * 60));
	const remainingMinutesAfterDays = minutes % (24 * 60);
	const hours = Math.floor(remainingMinutesAfterDays / 60);
	const remainingMinutes = remainingMinutesAfterDays % 60;

	return { days, hours, minutes: remainingMinutes };
}
