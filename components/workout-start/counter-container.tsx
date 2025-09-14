import { View } from "react-native";
import hasDurationPerRep from "~/lib/has-duration-per-rep";
import CounterDisplay from "./counter-display";
import hasRestBetweenReps from "~/lib/has-rest-between-reps";
import { Button } from "~/components/ui/button";
import { Info } from "~/lib/icons/Info";
import { cn } from "~/lib/utils";
import { memo, useLayoutEffect, useRef, useState } from "react";
import { Exercise } from "~/types";
import { useBottomSheet } from "~/hooks/use-bottom-sheet";
import { Text } from "~/components/ui/text";
import BottomSheetModal from "../bottom-sheet-modal";

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
				"flex w-full items-center justify-center gap-4 py-4",
				widths.setsCounter + widths.repsCounter > widths.parent // if sets/reps are too large, use a column instead
					? "flex-col"
					: "flex-row"
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
				className={cn(exercise.description.length === 0 && "opacity-0")}
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
				onChange={bottomSheet.onChange}
				maxDynamicContentSize={500}
				scrollable
			>
				<View className="p-4 pt-0">
					<Text>{description}</Text>
				</View>
			</BottomSheetModal>
		</View>
	);
});
