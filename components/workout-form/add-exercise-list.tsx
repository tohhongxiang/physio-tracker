import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import { useRef, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { WorkoutFormSchemaType } from "./schema";
import AddExercise from "./add-exercise";
import { CreateExercise } from "~/types";
import ExerciseCard from "../workout-details/exercise-card";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "~/hooks/use-bottom-sheet";
import { usePreventRemove } from "@react-navigation/native";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { Trash } from "~/lib/icons/Trash";
import { Pencil } from "~/lib/icons/Pencil";
import { useAlertDialog } from "~/providers/alert-dialog-provider";

export default function AddExerciseList({
	form: {
		control,
		formState: { errors },
		trigger
	},
	onGoToPreviousStep,
	onSuccessfulSubmit
}: {
	form: UseFormReturn<WorkoutFormSchemaType>;
	onGoToPreviousStep: () => void;
	onSuccessfulSubmit: () => void;
}) {
	const { fields, append, remove, move, update } = useFieldArray({
		control,
		name: "exercises"
	});

	const [isAddingExercise, setIsAddingExercise] = useState(false);
	function handleAddExercise(data: CreateExercise) {
		append(data);
		setIsAddingExercise(false);
		bottomSheet.close();
	}

	const [editingExerciseIndex, setEditingExerciseIndex] = useState(-1);
	function handleEditExercise(data: CreateExercise) {
		update(editingExerciseIndex, data);
		setEditingExerciseIndex(-1);
		bottomSheet.close();
	}

	const alert = useAlertDialog();
	function handleDeleteExercise(index: number) {
		alert({
			title: "Delete this exercise?",
			description: (
				<View className="flex flex-col gap-2">
					<Text className="text-muted-foreground">
						You are about to delete the following exercise:
					</Text>
					<ExerciseCard exercise={fields[index]} />
					<Text className="text-muted-foreground">Are you sure?</Text>
				</View>
			),
			variant: "destructive",
			actionText: "Delete",
			onConfirm() {
				remove(index);
			}
		});
	}

	async function handleSubmit() {
		const isValid = await trigger(["exercises"]);
		if (!isValid) return;

		onSuccessfulSubmit();
	}

	const scrollViewRef = useRef<Animated.FlatList<unknown> | null>(null);
	const previousHeight = useRef(-1);
	function handleContentSizeChanged(height: number) {
		if (height > previousHeight.current) {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		}

		previousHeight.current = height;
	}

	const bottomSheet = useBottomSheet();
	usePreventRemove(true, () => {
		if (bottomSheet.isOpen) {
			bottomSheet.close();
			return;
		}

		onGoToPreviousStep();
	});

	return (
		<View className="flex h-full grow flex-col gap-4 p-4">
			<Button
				onPress={() => {
					setIsAddingExercise(true);
					bottomSheet.open();
				}}
			>
				<Text>Add Exercise</Text>
			</Button>
			{errors.exercises && (
				<Text className="text-center text-destructive">
					{errors.exercises.message}
				</Text>
			)}
			<Animated.FlatList
				ref={scrollViewRef}
				data={fields}
				onContentSizeChange={(_, h) => handleContentSizeChanged(h)}
				itemLayoutAnimation={LinearTransition.duration(150).easing(
					Easing.ease
				)}
				ListEmptyComponent={
					<Text className="text-center text-lg italic text-muted-foreground opacity-75">
						No exercises yet.
					</Text>
				}
				contentContainerClassName={"min-h-0"}
				ItemSeparatorComponent={() => <View className="p-2" />}
				renderItem={({ item, index }) => (
					<View className="flex w-full flex-row">
						<ExerciseCard
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
										onPress={() => {
											setEditingExerciseIndex(index);
											bottomSheet.open();
										}}
										variant="secondary"
										size="icon"
									>
										<Pencil className="text-foreground" />
									</Button>
									<Button
										variant="destructive"
										size="icon"
										onPress={() =>
											handleDeleteExercise(index)
										}
									>
										<Trash className="text-destructive-foreground" />
									</Button>
									<Button
										disabled={index === fields.length - 1}
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
				)}
			/>
			<View className="mt-auto flex flex-row gap-4">
				<Button
					variant="secondary"
					className="flex-1"
					onPress={onGoToPreviousStep}
				>
					<Text>Previous</Text>
				</Button>
				<Button className="flex-1" onPress={handleSubmit}>
					<Text>Next</Text>
				</Button>
			</View>
			<BottomSheetModal
				ref={bottomSheet.ref}
				onChange={bottomSheet.setIsOpen}
				handleComponent={null}
				snapPoints={["100%"]}
				backgroundComponent={null}
				backdropComponent={null}
				enablePanDownToClose={true}
				enableDynamicSizing={false}
				enableOverDrag={false}
			>
				<BottomSheetView className="flex h-full flex-col gap-4 bg-popover pt-12">
					{isAddingExercise && (
						<AddExercise
							onCancel={() => {
								setIsAddingExercise(false);
								bottomSheet.close();
							}}
							onSubmit={handleAddExercise}
							mode="add"
						/>
					)}
					{editingExerciseIndex > -1 && (
						<AddExercise
							initialData={fields[editingExerciseIndex]}
							onCancel={() => {
								setEditingExerciseIndex(-1);
								bottomSheet.close();
							}}
							onSubmit={handleEditExercise}
							mode="update"
						/>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
}
