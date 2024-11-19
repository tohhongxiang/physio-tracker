import { View } from "react-native";
import { Text } from "~/components/ui/text";
import {
  Calendar,
  CalendarTheme,
  toDateId,
} from "@marceloterreiro/flash-calendar";
import { useState } from "react";

const theme: CalendarTheme = {
  rowMonth: {
    content: {
      fontWeight: 700,
    },
  },
  itemWeekName: {
    content: {
      fontWeight: 600,
      fontSize: 16,
    },
  },
};

export default function Screen() {
  const [selectedDate, setSelectedDate] = useState(toDateId(new Date()));
  const handleCalendarDayPress = (day: string) => {
    console.log(day);
    setSelectedDate(day);
  };

  return (
    <View className="flex flex-col flex-1 p-8 gap-4">
      <Calendar
        calendarMonthId={selectedDate}
        onCalendarDayPress={handleCalendarDayPress}
        theme={theme}
      />
    </View>
  );
}
