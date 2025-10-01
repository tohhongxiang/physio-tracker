import { Link } from "expo-router";
import { ArrowRight, Pin } from "lucide-react-native";
import { useCallback } from "react";
import { View } from "react-native";
import Animated, { AnimatedRef } from "react-native-reanimated";
import Sortable, { SortableGridRenderItem } from "react-native-sortables";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import WorkoutCard from "~/components/workout-card";
import useEditPinnedWorkoutPosition from "~/hooks/api/use-edit-pinned-workout-position";
import useGetPinnedWorkouts from "~/hooks/api/use-get-pinned-workouts";
import { Workout } from "~/types";

export default function PinnedWorkouts({
	scrollableRef
}: {
	scrollableRef?: AnimatedRef<Animated.ScrollView> | undefined;
}) {
	const { data: pinnedWorkouts, isPending: isFetchingPinnedWorkouts } =
		useGetPinnedWorkouts();

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

	const renderItem = useCallback<SortableGridRenderItem<Workout>>(
		({ item }) => <WorkoutCard workout={item} />,
		[]
	);
	return (
		<View className="flex flex-col gap-4">
			<Text className="text-2xl font-semibold tracking-tight">
				Pinned
			</Text>
			{isFetchingPinnedWorkouts ? (
				<View>
					<WorkoutCard.Loading />
				</View>
			) : !pinnedWorkouts || pinnedWorkouts.length === 0 ? (
				<View className="flex flex-col gap-4 justify-center items-center py-8">
					<Icon
						as={Pin}
						className="text-muted-foreground"
						size={48}
					/>
					<View className="flex flex-col gap-2 justify-center items-center">
						<Text className="text-lg font-bold">
							No pinned workouts
						</Text>
						<Text className="text-muted-foreground">
							Pin your favourite workouts for quick access!
						</Text>
					</View>
					<Link href="/(tabs)/workouts" asChild>
						<Button className="flex flex-row items-center justify-center gap-2">
							<Text className="text-center">Browse workouts</Text>
							<Icon
								as={ArrowRight}
								size={16}
								className="text-primary-foreground"
							/>
						</Button>
					</Link>
				</View>
			) : (
				<Sortable.Grid
					sortEnabled={
						!isFetchingPinnedWorkouts ||
						!isEditingPinnedWorkoutOrder
					}
					columns={1}
					rowGap={8}
					data={pinnedWorkouts}
					renderItem={renderItem}
					keyExtractor={(item) => `${item.id}`}
					overDrag="none"
					activeItemScale={1.05}
					inactiveItemScale={0.95}
					overflow="visible"
					scrollableRef={scrollableRef}
					onDragEnd={({ fromIndex, toIndex }) =>
						handleReorder(fromIndex, toIndex)
					}
				/>
			)}
		</View>
	);
}
