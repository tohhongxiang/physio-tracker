import { useQuery } from "@tanstack/react-query";

import getWorkoutLogs from "~/api/get-workout-logs";

import { workoutLogQueryKeys } from "./query-keys";

export default function useGetWorkoutLogs() {
	return useQuery({
		queryKey: workoutLogQueryKeys.all,
		queryFn: getWorkoutLogs
	});
}
