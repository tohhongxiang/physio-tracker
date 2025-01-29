import { forwardRef, useCallback, useEffect, useState } from "react";
import { useBottomSheet } from "~/hooks/use-bottom-sheet";
import SingleExerciseForm from "./single-exercise-form";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { CreateExercise } from "~/types";
import { usePreventRemove } from "@react-navigation/native";

export function useExerciseDetailBottomSheet({
	onAddExercise,
	onEditExercise
}: {
	onAddExercise: (data: CreateExercise) => void;
	onEditExercise: (index: number, updatedExercise: CreateExercise) => void;
}) {
	const bottomSheet = useBottomSheet();

	const [editingIndex, setEditingIndex] = useState(-1);
	const [initialData, setInitialData] = useState<CreateExercise | null>(null);
	const open = useCallback(
		(props?: { index: number; data: CreateExercise }) => {
			if (props) {
				setEditingIndex(props.index);
				setInitialData(props.data);
			}

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
const ExerciseDetailBottomSheet = forwardRef<
	BottomSheetModal<CreateExercise>,
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
	useEffect(() => {
		if (!isOpen) {
			onCancel();
		}
	}, [isOpen, onCancel]);

	return (
		<BottomSheetModal
			ref={ref}
			onChange={(index) => setIsOpen(index)}
			handleComponent={null}
			snapPoints={["100%"]}
			backgroundComponent={null}
			backdropComponent={null}
			enablePanDownToClose={true}
			enableDynamicSizing={false}
			enableOverDrag={false}
			keyboardBehavior="interactive"
			keyboardBlurBehavior="restore"
		>
			<BottomSheetView className="flex h-full flex-col gap-4 bg-popover pt-12">
				<SingleExerciseForm
					onCancel={onCancel}
					onSubmit={onSubmit}
					initialData={initialData}
				/>
			</BottomSheetView>
		</BottomSheetModal>
	);
});

export default ExerciseDetailBottomSheet;
