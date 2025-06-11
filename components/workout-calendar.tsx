import { addMonths, format, subMonths } from "date-fns";
import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { workoutLogQueryKeys } from "~/hooks/api/query-keys";
import { useCallback, useMemo, useRef } from "react";
import Calendar, { CalendarImperativeApi } from "react-native-swipe-calendar";
import { cn } from "~/lib/utils";
import { CircleCheckBig } from "~/lib/icons/CircleCheckBig";
import { Text } from "./ui/text";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Button } from "./ui/button";
import getWorkoutLogs from "~/api/get-workout-logs";

type WorkoutCalendarProps = {
	currentDate: Date;
	onDateChange: (date: Date) => void;
};

function toDateId(date: Date) {
	return format(date, "yyyy-MM-dd");
}

export default function WorkoutCalendar({
	currentDate,
	onDateChange
}: WorkoutCalendarProps) {
	const { data: completedWorkouts = [] } = useQuery({
		queryKey: workoutLogQueryKeys.all,
		queryFn: getWorkoutLogs
	});

	const markedDates = useMemo(
		() =>
			new Set(
				completedWorkouts.map((completedWorkouts) =>
					toDateId(new Date(completedWorkouts.completedAt))
				)
			),
		[completedWorkouts]
	);
	const renderDayComponent = useCallback(
		({
			date,
			isToday,
			isInDisplayedMonth
		}: {
			date: Date;
			isToday: boolean;
			isInDisplayedMonth: boolean;
		}) => {
			return (
				<View
					className={cn(
						"flex h-16 w-16 flex-1 items-center justify-center rounded-full",
						isToday && isInDisplayedMonth
							? markedDates.has(toDateId(date))
								? "bg-secondary"
								: "bg-primary"
							: ""
					)}
				>
					{isInDisplayedMonth ? (
						<View className="flex flex-col items-center justify-center">
							{markedDates.has(toDateId(date)) ? (
								<CircleCheckBig className="text-green-500" />
							) : (
								<Text
									className={cn(
										"text-center text-lg font-bold",
										!isInDisplayedMonth &&
											"text-muted-foreground opacity-50",
										isToday && "text-secondary"
									)}
								>
									{date.getDate()}
								</Text>
							)}
						</View>
					) : (
						<View />
					)}
				</View>
			);
		},
		[markedDates]
	);

	const ref = useRef<CalendarImperativeApi>(null);

	function onGoToPreviousMonth() {
		ref.current?.decrementPage();
		onDateChange(subMonths(currentDate, 1));
	}

	function onGoToNextMonth() {
		ref.current?.incrementPage();
		onDateChange(addMonths(currentDate, 1));
	}

	return (
		<View>
			<Calendar
				ref={ref}
				onPageChange={onDateChange}
				HeaderComponent={({ startDate }) => (
					<HeaderComponent
						title={`${startDate.toLocaleString("default", {
							month: "long"
						})} ${startDate.toLocaleString("default", {
							year: "numeric"
						})}`}
						onGoToNextMonth={onGoToNextMonth}
						onGoToPreviousMonth={onGoToPreviousMonth}
					/>
				)}
				DayLabelComponent={DayLabelComponent}
				DayComponent={renderDayComponent}
			/>
		</View>
	);
}

function DayLabelComponent({ date }: { date: Date }) {
	return (
		<View className="flex flex-1 items-center justify-center">
			<Text className="text-muted-foreground">
				{
					date.toLocaleDateString("default", {
						weekday: "short"
					})[0]
				}
			</Text>
		</View>
	);
}

function HeaderComponent({
	title,
	onGoToNextMonth,
	onGoToPreviousMonth
}: {
	title: string;
	onGoToNextMonth: () => void;
	onGoToPreviousMonth: () => void;
}) {
	return (
		<View className="relative flex flex-row items-center justify-between">
			<Button variant="ghost" onPress={onGoToPreviousMonth}>
				<ChevronLeft className="text-foreground" />
			</Button>
			<Text className="text-lg font-bold">{title}</Text>
			<Button variant="ghost" onPress={onGoToNextMonth}>
				<ChevronRight className="text-foreground" />
			</Button>
		</View>
	);
}
