import {
	Calendar,
	CalendarTheme,
	toDateId,
	useCalendar
} from "@marceloterreiro/flash-calendar";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { addMonths, getMonth, getYear, subMonths } from "date-fns";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { CircleCheckBig } from "~/lib/icons/CircleCheckBig";
import { useQuery } from "@tanstack/react-query";
import getWorkoutsDoneByYearMonth from "~/api/get-done-workouts-by-month-year";

const WEEK_DAYS_HEIGHT = 48;
const DAY_HEIGHT = 52;
const DAY_SPACING = 0;

const theme: CalendarTheme = {
	itemDay: {
		base: () => ({
			container: {
				paddingHorizontal: 8,
				paddingVertical: 8,
				borderRadius: "100%"
			}
		}),
		today: () => ({
			container: {
				borderWidth: 0
			}
		})
	}
};

type WorkoutCalendarProps = {
	currentDate: Date;
	onDateChange: (date: Date) => void;
};

export default function WorkoutCalendar({
	currentDate,
	onDateChange
}: WorkoutCalendarProps) {
	const { data: completedWorkouts = [] } = useQuery({
		queryKey: [
			"workout-logs",
			getYear(currentDate),
			getMonth(currentDate) + 1
		],
		queryFn: ({ queryKey }) =>
			getWorkoutsDoneByYearMonth(
				queryKey[1] as number,
				queryKey[2] as number
			)
	});

	const { calendarRowMonth, weekDaysList, weeksList } = useCalendar({
		calendarMonthId: toDateId(currentDate)
	});

	function onCalendarDayPress(id: string) {
		console.log(id);
	}

	function onGoToPreviousMonth() {
		onDateChange(subMonths(currentDate, 1));
	}

	function onGoToNextMonth() {
		onDateChange(addMonths(currentDate, 1));
	}

	const markedDates = new Set(
		completedWorkouts.map((completedWorkouts) =>
			toDateId(new Date(completedWorkouts.completedAt))
		)
	);

	return (
		<Calendar.VStack>
			<Calendar.HStack
				alignItems="center"
				justifyContent="space-between"
				width="100%"
			>
				<Button variant="ghost" onPress={onGoToPreviousMonth}>
					<ChevronLeft className="text-foreground" />
				</Button>
				<Text className="text-lg font-bold">{calendarRowMonth}</Text>
				<Button variant="ghost" onPress={onGoToNextMonth}>
					<ChevronRight className="text-foreground" />
				</Button>
			</Calendar.HStack>
			<Calendar.Row.Week>
				{weekDaysList.map((day, i) => (
					<Calendar.Item.WeekName height={WEEK_DAYS_HEIGHT} key={i}>
						<Text className="text-muted-foreground">{day}</Text>
					</Calendar.Item.WeekName>
				))}
			</Calendar.Row.Week>
			{weeksList.map((week, i) => (
				<Calendar.Row.Week key={i}>
					{week.map((day) => (
						<Calendar.Item.Day.Container
							dayHeight={DAY_HEIGHT}
							daySpacing={DAY_SPACING}
							isStartOfWeek={day.isStartOfWeek}
							key={day.id}
						>
							<View
								className={cn(
									"flex-1 rounded-full",
									day.isToday
										? markedDates.has(day.id)
											? "bg-secondary"
											: "bg-primary"
										: ""
								)}
							>
								{day.isDifferentMonth ? (
									<Calendar.Item.Empty height={DAY_HEIGHT} />
								) : (
									<Calendar.Item.Day
										height={DAY_HEIGHT}
										metadata={day}
										onPress={onCalendarDayPress}
										theme={theme.itemDay}
									>
										<View className="flex flex-col items-center justify-center">
											{markedDates.has(day.id) ? (
												<CircleCheckBig className="text-green-500" />
											) : (
												<Text
													className={cn(
														"text-center text-lg font-bold",
														day.isDifferentMonth &&
															"text-muted-foreground opacity-50",
														day.isToday &&
															"text-secondary"
													)}
												>
													{day.displayLabel}
												</Text>
											)}
										</View>
									</Calendar.Item.Day>
								)}
							</View>
						</Calendar.Item.Day.Container>
					))}
				</Calendar.Row.Week>
			))}
		</Calendar.VStack>
	);
}
