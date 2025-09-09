import { forwardRef, useCallback, useState } from "react";
import { useBottomSheet } from "~/hooks/use-bottom-sheet";
import SingleExerciseForm from "./single-exercise-form";
import { CreateExercise } from "~/types";
import { usePreventRemove } from "@react-navigation/native";
import BottomSheetModal, {
	BottomSheetModalRef
} from "~/components/bottom-sheet-modal";

const EMPTY_INDEX = -1;
const EMPTY_EXERCISE_DATA = null;
export function useExerciseDetailBottomSheet({
	onAddExercise,
	onEditExercise
}: {
	onAddExercise: (data: CreateExercise) => void;
	onEditExercise: (index: number, updatedExercise: CreateExercise) => void;
}) {
	const bottomSheet = useBottomSheet();

	const [editingIndex, setEditingIndex] = useState(EMPTY_INDEX);
	const [initialData, setInitialData] = useState<CreateExercise | null>(
		EMPTY_EXERCISE_DATA
	);
	const open = useCallback(
		(props?: { index: number; data: CreateExercise }) => {
			setEditingIndex(props?.index ?? EMPTY_INDEX);
			setInitialData(props?.data ?? EMPTY_EXERCISE_DATA);

			bottomSheet.open();
		},
		[bottomSheet]
	);

	const close = useCallback(() => {
		setInitialData(null);
		bottomSheet.close();
	}, [bottomSheet]);

	const confirm = useCallback(
		(data: CreateExercise) => {
			if (initialData) {
				onEditExercise(editingIndex, data);
			} else {
				onAddExercise(data);
			}

			setEditingIndex(-1);
			setInitialData(null);
			close();
		},
		[close, editingIndex, initialData, onAddExercise, onEditExercise]
	);

	usePreventRemove(bottomSheet.isOpen, () => {
		// pressing back button while bottom sheet is open should close it
		bottomSheet.close();
	});

	return {
		isOpen: bottomSheet.isOpen,
		open,
		cancel: close,
		exerciseDetailsBottomSheetProps: {
			// spread this into ExerciseDetailBottomSheet
			ref: bottomSheet.ref,
			isOpen: bottomSheet.isOpen,
			setIsOpen: bottomSheet.setIsOpen,
			onCancel: close,
			onSubmit: confirm,
			initialData
		}
	};
}

type ExerciseDetailBottomSheetProps = {
	isOpen: boolean;
	setIsOpen: (index: number) => void;
	onSubmit: (data: CreateExercise) => void;
	onCancel: () => void;
	initialData?: CreateExercise | null;
};

// ExerciseDetailBottomSheet should be used with useExerciseDetailBottomSheet
const snapPoints = ["80%"];
const ExerciseDetailBottomSheet = forwardRef<
	BottomSheetModalRef<CreateExercise>,
	ExerciseDetailBottomSheetProps
>(function ExerciseDetailBottomSheet(
	{
		isOpen,
		setIsOpen,
		onSubmit,
		onCancel,
		initialData
	}: ExerciseDetailBottomSheetProps,
	ref
) {
	return (
		<BottomSheetModal
			ref={ref}
			onChange={setIsOpen}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
		>
			<SingleExerciseForm
				isOpen={isOpen}
				onCancel={onCancel}
				onSubmit={onSubmit}
				initialData={initialData}
			/>
		</BottomSheetModal>
	);
});

export default ExerciseDetailBottomSheet;
