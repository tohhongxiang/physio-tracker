import { useQuery } from "@tanstack/react-query";
import { workoutLogQueryKeys } from "./query-keys";
import { getYear, getMonth } from "date-fns";
import getWorkoutsDoneByYearMonth from "~/api/get-done-workouts-by-month-year";

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
