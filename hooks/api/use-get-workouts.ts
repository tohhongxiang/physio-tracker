import { useQuery } from "@tanstack/react-query";

import getWorkouts from "~/api/get-workouts";
import { WorkoutFilters } from "~/db/dto";

import { PageParams } from "../use-page-params";
import { workoutQueryKeys } from "./query-keys";

export default function useGetWorkouts(
	options: WorkoutFilters & { page: PageParams["page"] }
) {
	return useQuery({
		queryKey: workoutQueryKeys.list(options),
		queryFn: () => getWorkouts(options),
		refetchOnMount: false // prevent race condition where workout is created, but exercise is not created
	});
}
