import { useQuery } from "@tanstack/react-query";
import { workoutQueryKeys } from "./query-keys";
import { Exercise, Workout } from "~/types";
import getExercise from "~/api/get-exercise";

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
