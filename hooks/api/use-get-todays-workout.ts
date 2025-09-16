import { useQuery } from "@tanstack/react-query";

import getWorkoutToday from "~/api/get-workout-today";

import { workoutQueryKeys } from "./query-keys";

export default function useGetTodaysWorkout() {
	return useQuery({
		queryKey: workoutQueryKeys.today(),
		queryFn: getWorkoutToday
	});
}
