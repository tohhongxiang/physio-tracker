import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import getWorkout from "~/api/get-workout";
import WorkoutNotFound from "~/components/workout-not-found";
import WorkoutStartPage from "~/components/workout-start";
import { workoutQueryKeys } from "~/hooks/api/query-keys";

export default function StartWorkoutPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data, isPending } = useQuery({
		queryKey: workoutQueryKeys.detail(parseInt(id)),
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});

	if (isPending) {
		return <WorkoutStartPage.Loading />;
	}

	if (!data) {
		return <WorkoutNotFound />;
	}

	return <WorkoutStartPage workout={data} />;
}
