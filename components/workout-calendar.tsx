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
import { useState } from "react";
import { addMonths, startOfMonth, subMonths } from "date-fns";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { CircleCheckBig } from "~/lib/icons/CircleCheckBig";

const WEEK_DAYS_HEIGHT = 48;
const DAY_HEIGHT = 52;
const DAY_SPACING = 0;

const theme: CalendarTheme = {
	itemDay: {
		base: () => ({
			container: {
				paddingHorizontal: 8,
				paddingVertical: 2,
				borderRadius: 4,
				width: "100%"
			}
		}),
		today: () => ({
			container: {
				borderWidth: 0,
				backgroundColor: "inherit"
			}
		})
	}
};

const MARKED_DATES = [
	new Date("2024-11-22"),
	new Date("2024-11-24"),
	new Date("2024-11-25"),
	new Date("2024-11-26"),
	new Date("2024-11-27"),
	new Date("2024-11-28"),
	new Date("2024-11-29"),
	new Date("2024-11-30"),
	new Date("2024-12-1"),
	new Date("2024-12-2"),
	new Date("2024-12-3"),
	new Date("2024-12-12"),
	new Date("2024-12-13"),
	new Date("2024-12-14"),
	new Date("2024-12-15")
];

export default function WorkoutCalendar() {
	const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
	const { calendarRowMonth, weekDaysList, weeksList } = useCalendar({
		calendarMonthId: toDateId(currentMonth)
	});

	function onCalendarDayPress(id: string) {
		console.log(id);
	}

	function onGoToPreviousMonth() {
		setCurrentMonth(subMonths(currentMonth, 1));
	}

	function onGoToNextMonth() {
		setCurrentMonth(addMonths(currentMonth, 1));
	}

	const markedDates = new Set(MARKED_DATES.map((date) => toDateId(date)));
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
									day.isToday && "bg-foreground"
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
												<CircleCheckBig className="text-green-600 dark:text-green-500" />
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
