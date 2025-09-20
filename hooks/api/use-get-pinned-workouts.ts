import { useQuery } from "@tanstack/react-query";

import getPinnedWorkouts from "~/api/get-pinned-workouts";

import { workoutQueryKeys } from "./query-keys";

export default function useGetPinnedWorkouts() {
	return useQuery({
		queryKey: workoutQueryKeys.pinned.all(),
		queryFn: getPinnedWorkouts
	});
}
