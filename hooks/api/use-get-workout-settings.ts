import { useQuery } from "@tanstack/react-query";

import getWorkoutSettings from "~/api/get-workout-settings";

import { workoutSettingsQueryKeys } from "./query-keys";

export default function useGetWorkoutSettings() {
	return useQuery({
		queryKey: workoutSettingsQueryKeys.all,
		queryFn: getWorkoutSettings,
		staleTime: Infinity // Settings rarely change, cache indefinitely
	});
}
