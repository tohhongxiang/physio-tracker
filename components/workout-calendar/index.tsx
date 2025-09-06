import { addMonths, subMonths } from "date-fns";
import { useCallback, useMemo, useRef } from "react";
import Calendar, { CalendarImperativeApi } from "react-native-swipe-calendar";
import Header from "./header";
import DayLabel from "./day-label";
import toDateId from "./to-date-id";
import Day from "./day";
import useGetWorkoutLogs from "~/hooks/api/use-get-workout-logs";

type WorkoutCalendarProps = {
	currentDate: Date;
	onDateChange: (date: Date) => void;
};

export default function WorkoutCalendar({
	currentDate,
	onDateChange
}: WorkoutCalendarProps) {
	const { data: completedWorkouts = [] } = useGetWorkoutLogs();

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
				<Day
					date={date}
					isToday={isToday}
					isInDisplayedMonth={isInDisplayedMonth}
					isMarked={markedDates.has(toDateId(date))}
				/>
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
		<Calendar
			ref={ref}
			onPageChange={onDateChange}
			HeaderComponent={({ startDate }) => (
				<Header
					title={`${startDate.toLocaleString("default", {
						month: "long"
					})} ${startDate.toLocaleString("default", {
						year: "numeric"
					})}`}
					onGoToNextMonth={onGoToNextMonth}
					onGoToPreviousMonth={onGoToPreviousMonth}
				/>
			)}
			DayLabelComponent={DayLabel}
			DayComponent={renderDayComponent}
		/>
	);
}
