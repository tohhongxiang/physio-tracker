import { View } from "react-native";
import hasDurationPerRep from "~/lib/has-duration-per-rep";
import CounterDisplay from "./counter-display";
import hasRestBetweenReps from "~/lib/has-rest-between-reps";
import { Button } from "~/components/ui/button";
import { Info } from "~/lib/icons/Info";
import { cn } from "~/lib/utils";
import { memo, useLayoutEffect, useRef, useState } from "react";
import { Exercise } from "~/types";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetView
} from "@gorhom/bottom-sheet";
import { useBottomSheet } from "~/hooks/use-bottom-sheet";
import { Text } from "~/components/ui/text";

export default memo(function CounterContainer({
	exercise,
	currentRep,
	currentSet,
	description
}: {
	exercise: Exercise;
	currentRep: number;
	currentSet: number;
	description: string;
}) {
	const setsCounterRef = useRef<View | null>(null);
	const repsCounterRef = useRef<View | null>(null);
	const parentContainerRef = useRef<View | null>(null);
	const [widths, setWidths] = useState({
		setsCounter: 0,
		repsCounter: 0,
		parent: 0
	});
	useLayoutEffect(() => {
		if (
			!setsCounterRef.current ||
			!repsCounterRef.current ||
			!parentContainerRef.current
		)
			return;

		// https://github.com/facebook/react-native/issues/953
		setsCounterRef.current?.measure((_, __, width) =>
			setWidths((prev) => ({ ...prev, setsCounter: width }))
		);
		repsCounterRef.current?.measure((_, __, width) =>
			setWidths((prev) => ({ ...prev, repsCounter: width }))
		);
		parentContainerRef.current?.measure((_, __, width) =>
			setWidths((prev) => ({ ...prev, parent: width }))
		);
	}, []);

	const bottomSheet = useBottomSheet();
	return (
		<View
			className={cn(
				"flex items-center py-4",
				widths.setsCounter + widths.repsCounter > widths.parent
					? "flex-col justify-center gap-4"
					: "flex-row justify-around gap-8"
			)}
			ref={parentContainerRef}
		>
			<CounterDisplay
				title="REPS"
				text={
					hasDurationPerRep(exercise) || hasRestBetweenReps(exercise)
						? `${currentRep} / ${exercise.reps}`
						: exercise.reps.toString()
				}
				ref={repsCounterRef}
			/>
			<Button
				variant="ghost"
				disabled={exercise.description.length === 0}
				onPress={bottomSheet.open}
			>
				<Info className="text-primary" />
			</Button>
			<CounterDisplay
				title="SETS"
				ref={setsCounterRef}
				text={`${currentSet} / ${exercise.sets}`}
			/>
			<BottomSheetModal
				ref={bottomSheet.ref}
				onChange={bottomSheet.setIsOpen}
				enablePanDownToClose
				handleComponent={() => (
					<View className="flex items-center justify-center rounded-t-xl border border-b-0 border-input bg-popover pt-4">
						<View className="h-1 w-16 rounded-md bg-muted-foreground" />
					</View>
				)}
				backgroundComponent={null}
				enableOverDrag={false}
				maxDynamicContentSize={500}
				backdropComponent={(props) => (
					<BottomSheetBackdrop
						opacity={1}
						pressBehavior={"close"}
						disappearsOnIndex={-1}
						style={{
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							height: "100%",
							width: "100%"
						}}
						{...props}
					/>
				)}
			>
				<BottomSheetView className="flex flex-col gap-4 bg-popover">
					<BottomSheetScrollView className="p-8 pb-16">
						<Text>{description}</Text>
					</BottomSheetScrollView>
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
});
