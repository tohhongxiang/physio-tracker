import { View } from "react-native";
import { Button } from "../../ui/button";
import { FieldArrayWithId } from "react-hook-form";
import { WorkoutFormSchemaType } from "../schema";
import ExerciseCard from "../../workout-details/exercise-card";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { Trash } from "~/lib/icons/Trash";
import { Pencil } from "~/lib/icons/Pencil";
import { useCallback, useRef } from "react";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import type { SortableGridRenderItem } from "react-native-sortables";
import Sortable from "react-native-sortables";

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
						onMoveUp={
							index === 0
								? undefined
								: () => onMove(index, index - 1)
						}
						onMoveDown={
							index === data.length - 1
								? undefined
								: () => onMove(index, index + 1)
						}
					/>
				</Sortable.Touchable>
			);
		},
		[data.length, onDelete, onEdit, onMove]
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
			/>
		</Animated.ScrollView>
	);
}

function ListItem({
	item,
	onEdit, // pass undefined if cannot edit
	onDelete, // pass undefined if cannot delete
	onMoveUp, // pass undefined if cannot move up
	onMoveDown // pass undefined if cannot move down
}: {
	item: ExerciseData;
	onEdit?: () => void;
	onDelete?: () => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
}) {
	return (
		<View className="flex w-full flex-row">
			<ExerciseCard
				key={item.key}
				exercise={item}
				className="shrink"
				actions={
					<View className="flex shrink-0 flex-row gap-4">
						<Button
							disabled={!onMoveUp}
							variant="ghost"
							size="icon"
							onPress={onMoveUp}
						>
							<ChevronUp className="text-foreground" />
						</Button>
						<Button
							disabled={!onEdit}
							onPress={onEdit}
							variant="secondary"
							size="icon"
						>
							<Pencil className="text-foreground" />
						</Button>
						<Button
							variant="destructive"
							size="icon"
							disabled={!onDelete}
							onPress={onDelete}
						>
							<Trash className="text-destructive-foreground" />
						</Button>
						<Button
							disabled={!onMoveDown}
							variant="ghost"
							size="icon"
							onPress={onMoveDown}
						>
							<ChevronDown className="text-foreground" />
						</Button>
					</View>
				}
			/>
		</View>
	);
}
