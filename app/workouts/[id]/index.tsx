import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import getWorkout from "~/api/getWorkout";
import WorkoutDetails from "~/components/workout-details";

export default function SpecificWorkOutRoute() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isPending } = useQuery({
		queryKey: ["workouts", id],
		queryFn: ({ queryKey }) => getWorkout(queryKey[1])
	});

	if (isPending) {
		return <WorkoutDetails.Loading />;
	}

	if (!data) {
		return <WorkoutDetails.NotFound />;
	}

	if (data.exercises.length === 0) {
		return <WorkoutDetails.NoExercises id={id} />;
	}

	return <WorkoutDetails workout={data} />;
}
