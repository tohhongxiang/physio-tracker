import { useQuery } from "@tanstack/react-query";

import getExercise from "~/api/get-exercise";
import { Exercise, Workout } from "~/db/dto";

import { workoutQueryKeys } from "./query-keys";

export default function useGetExercise({
	workoutId,
	exerciseId
}: {
	workoutId: Workout["id"];
	exerciseId: Exercise["id"];
}) {
	return useQuery({
		queryKey: workoutQueryKeys.exercises.detail(workoutId, exerciseId),
		queryFn: ({ queryKey: [, workoutId, , exerciseId] }) =>
			getExercise(workoutId, exerciseId)
	});
}
