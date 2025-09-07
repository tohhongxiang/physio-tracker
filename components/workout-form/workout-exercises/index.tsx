import { View } from "react-native";
import { Button } from "../../ui/button";
import { Text } from "../../ui/text";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { WorkoutFormSchemaType } from "../schema";
import ExerciseCard from "../../workout-details/exercise-card";
import { usePreventRemove } from "@react-navigation/native";
import { useAlertDialog } from "~/providers/alert-dialog-provider";
import ExerciseDetailBottomSheet, {
	useExerciseDetailBottomSheet
} from "./exercise-detail-bottom-sheet";
import VirtualizedExerciseList from "./virtualized-exercise-list";

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

	const { isOpen, open, exerciseDetailsBottomSheetProps } =
		useExerciseDetailBottomSheet({
			onAddExercise: (newExercise) => append(newExercise),
			onEditExercise: (index, updatedExercise) =>
				update(index, updatedExercise) // this causes a remount
		});

	usePreventRemove(!isOpen, () => {
		onGoToPreviousStep();
	});

	return (
		<View className="flex h-full grow flex-col gap-4 p-4">
			<Button onPress={() => open()}>
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
					onEdit={(index) => open({ index, data: fields[index] })}
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
			<ExerciseDetailBottomSheet {...exerciseDetailsBottomSheetProps} />
		</View>
	);
}
