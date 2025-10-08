import { useCallback } from "react";
import Animated, { AnimatedRef } from "react-native-reanimated";
import Sortable, { SortableGridRenderItem } from "react-native-sortables";

import { WorkoutWithExercises } from "~/db/dto";

import WorkoutCard from "../workout-card";

interface PinnedWorkoutsListProps {
	workouts: WorkoutWithExercises[];
	sortEnabled: boolean;
	scrollableRef?: AnimatedRef<Animated.ScrollView>;
	onReorder: (fromIndex: number, toIndex: number) => void;
}

export default function PinnedWorkoutsList({
	workouts = [],
	sortEnabled,
	scrollableRef,
	onReorder
}: PinnedWorkoutsListProps) {
	const renderItem = useCallback<
		SortableGridRenderItem<WorkoutWithExercises>
	>(({ item }) => <WorkoutCard workout={item} />, []);

	return (
		<Sortable.Grid
			sortEnabled={sortEnabled}
			columns={1}
			rowGap={8}
			data={workouts}
			renderItem={renderItem}
			keyExtractor={(item) => `${item.id}`}
			overDrag="none"
			activeItemScale={1.05}
			inactiveItemScale={0.95}
			overflow="visible"
			scrollableRef={scrollableRef}
			onDragEnd={({ fromIndex, toIndex }) =>
				onReorder(fromIndex, toIndex)
			}
		/>
	);
}
