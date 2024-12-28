import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import getWorkoutLogs from "~/api/get-workout-logs";
import WorkoutLogsList from "~/components/workout-logs";
import { workoutLogQueryKeys } from "~/hooks/api/query-keys";

export default function RecentWorkouts() {
	const { isPending, data } = useQuery({
		queryKey: workoutLogQueryKeys.all,
		queryFn: getWorkoutLogs
	});

	if (isPending) {
		return (
			<View>
				<WorkoutLogsList.Loading />
			</View>
		);
	}

	return (
		<View>
			<WorkoutLogsList logs={data ?? []} />
		</View>
	);
}
