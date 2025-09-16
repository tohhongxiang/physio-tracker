import { useLocalSearchParams } from "expo-router";

import WorkoutNotFound from "~/components/workout-not-found";
import WorkoutStartPage from "~/components/workout-start";
import useGetWorkout from "~/hooks/api/use-get-workout";

export default function StartWorkoutPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data, isPending } = useGetWorkout({ id: parseInt(id) });

	if (isPending) {
		return <WorkoutStartPage.Loading />;
	}

	if (!data) {
		return <WorkoutNotFound />;
	}

	return <WorkoutStartPage workout={data} />;
}
