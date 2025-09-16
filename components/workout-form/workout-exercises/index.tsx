import { useCallback, useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { View } from "react-native";

import BottomSheetModal from "~/components/bottom-sheet-modal";
import { useBottomSheet } from "~/hooks/use-bottom-sheet";
import { useAlertDialog } from "~/providers/alert-dialog-provider";
import { CreateExercise } from "~/types";

import { Button } from "../../ui/button";
import { Text } from "../../ui/text";
import ExerciseCard from "../../workout-details/exercise-card";
import { WorkoutFormSchemaType } from "../schema";
import SingleExerciseForm from "./single-exercise-form";
import VirtualizedExerciseList from "./virtualized-exercise-list";

const EMPTY_INDEX = -1;
const EMPTY_EXERCISE_DATA = null;
const SNAP_POINTS = ["80%"];
export default function WorkoutExercises({
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
		name: "exercises",
		keyName: "key"
	});

	const alert = useAlertDialog();
	const handleDeleteExercise = useCallback(
		(index: number) => {
			alert({
				title: "Delete this exercise?",
				description: (
					<View className="flex flex-col gap-2">
						<Text className="text-muted-foreground">
							You are about to delete the following exercise:
						</Text>
						<ExerciseCard exercise={fields[index]} />
						<Text className="text-muted-foreground">
							Are you sure?
						</Text>
					</View>
				),
				variant: "destructive",
				actionText: "Delete",
				onConfirm() {
					remove(index);
				}
			});
		},
		[alert, fields, remove]
	);

	async function handleSubmit() {
		const isValid = await trigger(["exercises"]);
		if (!isValid) return;

		onSuccessfulSubmit();
	}

	const {
		exerciseFormData,
		handleStartAddExercise,
		handleStartEditExercise,
		handleConfirm,
		bottomSheet
	} = useEditOrAddExercise({
		exercises: fields,
		onAddExercise: append,
		onUpdateExercise: update
	});

	return (
		<View className="flex h-full grow flex-col gap-4 p-4">
			<Button onPress={handleStartAddExercise}>
				<Text>Add Exercise</Text>
			</Button>
			{errors.exercises && (
				<Text className="text-center text-destructive">
					{errors.exercises.message}
				</Text>
			)}
			<View className="flex-1">
				<VirtualizedExerciseList
					data={fields}
					onMove={move}
					onEdit={handleStartEditExercise}
					onDelete={handleDeleteExercise}
				/>
			</View>
			<View className="mt-auto flex flex-row gap-4 bg-background">
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
				snapPoints={SNAP_POINTS}
				enableDynamicSizing={false}
				onChange={bottomSheet.onChange}
			>
				<SingleExerciseForm
					onCancel={bottomSheet.close}
					onSubmit={handleConfirm}
					initialData={exerciseFormData}
				/>
			</BottomSheetModal>
		</View>
	);
}

function useEditOrAddExercise({
	exercises,
	onAddExercise,
	onUpdateExercise
}: {
	exercises: CreateExercise[];
	onAddExercise: (exercise: CreateExercise) => void;
	onUpdateExercise: (index: number, exercise: CreateExercise) => void;
}) {
	const [editingIndex, setEditingIndex] = useState(EMPTY_INDEX);
	const [initialData, setInitialData] = useState<CreateExercise | null>(null);

	const bottomSheet = useBottomSheet();
	const handleStartAddExercise = () => {
		setEditingIndex(-1);
		setInitialData(EMPTY_EXERCISE_DATA);
		bottomSheet.open();
	};

	const handleStartEditExercise = (index: number) => {
		setEditingIndex(index);
		setInitialData(exercises[index]);
		bottomSheet.open();
	};

	const handleConfirm = (exercise: CreateExercise) => {
		if (initialData) {
			onUpdateExercise(editingIndex, exercise);
		} else {
			onAddExercise(exercise);
		}

		setEditingIndex(-1);
		setInitialData(null);
		bottomSheet.close();
	};

	return {
		exerciseFormData: initialData,
		handleStartAddExercise,
		handleStartEditExercise,
		handleConfirm,
		bottomSheet
	};
}
