import { useCallback } from "react";
import { View } from "react-native";
import Animated, { AnimatedRef } from "react-native-reanimated";
import { toast } from "sonner-native";

import { Text } from "~/components/ui/text";
import WorkoutCard from "~/components/workout-card";
import useEditPinnedWorkoutPosition from "~/hooks/api/use-edit-pinned-workout-position";
import useGetPinnedWorkouts from "~/hooks/api/use-get-pinned-workouts";

import ErrorScreen from "../error-screen";
import EmptyPinnedWorkoutsList from "./empty-pinned-workouts-list";
import PinnedWorkoutsList from "./pinned-workouts-list";

export default function PinnedWorkouts({
	scrollableRef
}: {
	scrollableRef?: AnimatedRef<Animated.ScrollView> | undefined;
}) {
	const {
		data: pinnedWorkouts,
		isPending: isFetchingPinnedWorkouts,
		error: fetchPinnedWorkoutsError,
		refetch: refetchPinnedWorkouts
	} = useGetPinnedWorkouts();

	const { isLoading: isEditingPinnedWorkoutOrder, editPinnedWorkoutOrder } =
		useEditPinnedWorkoutPosition({
			onError: (error) => toast.error(error.message)
		});

	const handleReorder = useCallback(
		(fromIndex: number, toIndex: number) => {
			const workoutBeingReordered = pinnedWorkouts?.[fromIndex];

			if (!workoutBeingReordered) {
				return;
			}

			editPinnedWorkoutOrder({
				workoutId: workoutBeingReordered.id,
				newIndex: toIndex
			});
		},
		[editPinnedWorkoutOrder, pinnedWorkouts]
	);

	return (
		<View className="flex flex-col gap-4">
			<Text className="text-2xl font-semibold tracking-tight">
				Pinned
			</Text>
			{isFetchingPinnedWorkouts ? (
				<WorkoutCard.Loading />
			) : fetchPinnedWorkoutsError ? (
				<ErrorScreen
					error={fetchPinnedWorkoutsError}
					onRetry={refetchPinnedWorkouts}
					showBackButton={false}
					descriptionText="Something went wrong while loading the pinned workouts. Please try again or come back later."
				/>
			) : !pinnedWorkouts || pinnedWorkouts.length === 0 ? (
				<EmptyPinnedWorkoutsList />
			) : (
				<PinnedWorkoutsList
					workouts={pinnedWorkouts}
					sortEnabled={
						!isFetchingPinnedWorkouts ||
						!isEditingPinnedWorkoutOrder
					}
					scrollableRef={scrollableRef}
					onReorder={handleReorder}
				/>
			)}
		</View>
	);
}
