import { View } from "react-native";
import { Button } from "../../ui/button";
import { FieldArrayWithId } from "react-hook-form";
import { WorkoutFormSchemaType } from "../schema";
import ExerciseCard from "../../workout-details/exercise-card";
import { Trash } from "~/lib/icons/Trash";
import { Pencil } from "~/lib/icons/Pencil";
import { useCallback, useRef } from "react";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import type { SortableGridRenderItem } from "react-native-sortables";
import Sortable from "react-native-sortables";
import { GripVertical } from "~/lib/icons/GripVertical";

type ExerciseData = FieldArrayWithId<WorkoutFormSchemaType, "exercises", "key">;
export default function VirtualizedExerciseList({
	data,
	onMove,
	onEdit,
	onDelete
}: {
	data: ExerciseData[];
	onMove: (from: number, to: number) => void;
	onEdit: (index: number) => void;
	onDelete: (index: number) => void;
}) {
	const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
	const previousHeight = useRef(-1);
	const handleContentSizeChanged = useCallback(
		(width: number, height: number) => {
			if (
				previousHeight.current !== -1 &&
				height > previousHeight.current
			) {
				// only scroll down when adding a new item and not first render
				scrollViewRef.current?.scrollToEnd({ animated: true });
			}

			previousHeight.current = height;
		},
		[scrollViewRef]
	);

	// Does not need key, handled by react-native-sortables
	const renderItem = useCallback<SortableGridRenderItem<ExerciseData>>(
		({ item, index }) => {
			return (
				<Sortable.Touchable>
					<ListItem
						item={item}
						onEdit={() => onEdit(index)}
						onDelete={() => onDelete(index)}
					/>
				</Sortable.Touchable>
			);
		},
		[onDelete, onEdit]
	);

	return (
		<Animated.ScrollView
			ref={scrollViewRef}
			onContentSizeChange={handleContentSizeChanged}
		>
			<Sortable.Grid
				itemEntering={null}
				itemExiting={null}
				columns={1}
				data={data}
				rowGap={8}
				overDrag="none"
				activeItemScale={1}
				inactiveItemScale={0.95}
				renderItem={renderItem}
				keyExtractor={(item) => `draggable-item-${item.id ?? item.key}`}
				onDragEnd={({ fromIndex, toIndex }) =>
					onMove(fromIndex, toIndex)
				}
				scrollableRef={scrollViewRef}
				autoScrollActivationOffset={150}
				overflow="visible"
				customHandle
			/>
		</Animated.ScrollView>
	);
}

function ListItem({
	item,
	onEdit, // pass undefined if cannot edit
	onDelete // pass undefined if cannot delete
}: {
	item: ExerciseData;
	onEdit?: () => void;
	onDelete?: () => void;
}) {
	return (
		<View className="flex w-full flex-row items-center justify-center">
			<ExerciseCard
				key={item.key}
				exercise={item}
				className="shrink"
				actions={
					<View className="flex shrink-0 flex-row items-center justify-center gap-4">
						<Button
							disabled={!onEdit}
							onPress={onEdit}
							variant="ghost"
							size="sm"
						>
							<Pencil className="text-muted-foreground" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							disabled={!onDelete}
							onPress={onDelete}
						>
							<Trash className="text-destructive opacity-90" />
						</Button>
						<Sortable.Handle>
							<View className="flex h-9 w-9 flex-col items-center justify-center">
								<GripVertical className="text-muted-foreground" />
							</View>
						</Sortable.Handle>
					</View>
				}
			/>
		</View>
	);
}
