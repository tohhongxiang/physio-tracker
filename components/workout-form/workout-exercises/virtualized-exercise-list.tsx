import { View } from "react-native";
import { Button } from "../../ui/button";
import { Text } from "../../ui/text";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import { FieldArrayWithId } from "react-hook-form";
import { WorkoutFormSchemaType } from "../schema";
import ExerciseCard from "../../workout-details/exercise-card";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { Trash } from "~/lib/icons/Trash";
import { Pencil } from "~/lib/icons/Pencil";
import { useCallback, useRef } from "react";

type ExerciseData = FieldArrayWithId<WorkoutFormSchemaType, "exercises", "key">;
const itemLayoutAnimation = LinearTransition.duration(150).easing(Easing.ease);
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
	const scrollViewRef = useRef<Animated.FlatList<ExerciseData>>(null);
	const previousHeight = useRef(-1);
	const handleContentSizeChanged = useCallback(
		(width: number, height: number) => {
			if (height > previousHeight.current) {
				// only scroll down when adding a new item
				scrollViewRef.current?.scrollToEnd({ animated: true });
			}

			previousHeight.current = height;
		},
		[]
	);

	const renderItem = useCallback(
		({ item, index }: { item: (typeof data)[number]; index: number }) => {
			return (
				<ListItem
					key={item.key}
					item={item}
					index={index}
					move={onMove}
					onEdit={onEdit}
					onDelete={onDelete}
					isLastIndex={index === data.length - 1}
				/>
			);
		},
		[data.length, onDelete, onEdit, onMove]
	);

	return (
		<Animated.FlatList
			ref={scrollViewRef}
			data={data}
			onContentSizeChange={handleContentSizeChanged}
			itemLayoutAnimation={itemLayoutAnimation}
			ListEmptyComponent={
				<Text className="text-center text-lg italic text-muted-foreground opacity-75">
					No exercises yet.
				</Text>
			}
			contentContainerClassName={"min-h-0 gap-4"}
			renderItem={renderItem}
		/>
	);
}

function ListItem({
	item,
	index,
	move,
	onEdit,
	onDelete,
	isLastIndex
}: {
	item: ExerciseData;
	index: number;
	move: (from: number, to: number) => void;
	onEdit: (index: number) => void;
	onDelete: (index: number) => void;
	isLastIndex: boolean;
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
							disabled={index === 0}
							variant="ghost"
							size="icon"
							onPress={() => move(index, index - 1)}
						>
							<ChevronUp className="text-foreground" />
						</Button>
						<Button
							onPress={() => onEdit(index)}
							variant="secondary"
							size="icon"
						>
							<Pencil className="text-foreground" />
						</Button>
						<Button
							variant="destructive"
							size="icon"
							onPress={() => onDelete(index)}
						>
							<Trash className="text-destructive-foreground" />
						</Button>
						<Button
							disabled={isLastIndex}
							variant="ghost"
							size="icon"
							onPress={() => move(index, index + 1)}
						>
							<ChevronDown className="text-foreground" />
						</Button>
					</View>
				}
			/>
		</View>
	);
}
