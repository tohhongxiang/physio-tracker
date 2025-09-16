import { useQuery } from "@tanstack/react-query";
import { getMonth, getYear } from "date-fns";

import getWorkoutsDoneByYearMonth from "~/api/get-done-workouts-by-month-year";

import { workoutLogQueryKeys } from "./query-keys";

export default function useGetWorkoutLogsByMonthYear(currentDate: Date) {
	return useQuery({
		queryKey: workoutLogQueryKeys.month(
			getYear(currentDate),
			getMonth(currentDate) + 1,
			true
		),
		queryFn: ({ queryKey }) =>
			getWorkoutsDoneByYearMonth(queryKey[1], queryKey[2], true)
	});
}
