import { useQuery } from "@tanstack/react-query";

import getPinnedWorkout from "~/api/get-pinned-workout";
import { Workout } from "~/db/dto";

import { workoutQueryKeys } from "./query-keys";

export default function useGetPinnedWorkout({ id }: { id: Workout["id"] }) {
	return useQuery({
		queryKey: workoutQueryKeys.pinned.detail(id),
		queryFn: ({ queryKey }) => getPinnedWorkout(queryKey[2])
	});
}
