import { View } from "react-native";
import hasDurationPerRep from "~/lib/has-duration-per-rep";
import CounterDisplay from "../counter-display";
import hasRestBetweenReps from "~/lib/has-rest-between-reps";
import { Button } from "../../ui/button";
import { Info } from "~/lib/icons/Info";
import DescriptionDialog from "../description-dialog";
import { cn } from "~/lib/utils";
import { useLayoutEffect, useRef, useState } from "react";
import { Exercise } from "~/types";

export default function CounterContainer({
	exercise,
	currentRep,
	currentSet
}: {
	exercise: Exercise;
	currentRep: number;
	currentSet: number;
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

	return (
		<View
			className={cn(
				"flex w-full flex-row items-center gap-4 py-4",
				widths.setsCounter + widths.repsCounter > widths.parent
					? "flex-col justify-center"
					: "flex-row flex-wrap justify-around"
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
			{exercise.description ? (
				<DescriptionDialog text={exercise.description}>
					<Button variant="ghost">
						<Info className="text-primary" />
					</Button>
				</DescriptionDialog>
			) : null}
			<CounterDisplay
				title="SETS"
				ref={setsCounterRef}
				text={`${currentSet} / ${exercise.sets}`}
			/>
		</View>
	);
}
