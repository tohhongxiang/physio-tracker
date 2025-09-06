import { WorkoutFilters } from "~/types";
import { PageParams } from "../use-page-params";
import { useQuery } from "@tanstack/react-query";
import getWorkouts from "~/api/get-workouts";
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
