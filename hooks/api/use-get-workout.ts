import { useQuery } from "@tanstack/react-query";

import getWorkout from "~/api/get-workout";
import { Workout } from "~/types";

import { workoutQueryKeys } from "./query-keys";

export default function useGetWorkout({ id }: { id: Workout["id"] }) {
	return useQuery({
		queryKey: workoutQueryKeys.detail(id),
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});
}
