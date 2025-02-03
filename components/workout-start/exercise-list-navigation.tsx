import { View } from "react-native";
import { Button } from "../ui/button";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { Text } from "../ui/text";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { memo } from "react";

export default memo(function ExerciseListNavigation({
	currentExerciseName,
	previousButtonDisabled,
	nextButtonDisabled,
	onGoToPrevious,
	onGoToNext
}: {
	currentExerciseName: string;
	previousButtonDisabled?: boolean;
	nextButtonDisabled?: boolean;
	onGoToPrevious?: () => void;
	onGoToNext?: () => void;
}) {
	// not sure why: Without `border`, sometimes the text overflows
	return (
		<View className="flex w-full flex-row items-center justify-between gap-4 px-4">
			<Button
				variant="ghost"
				size="icon"
				disabled={previousButtonDisabled}
				onPress={onGoToPrevious}
				className="shrink-0"
			>
				<ChevronLeft className="text-foreground" />
			</Button>
			<Text className="line-clamp-2 flex shrink text-center text-2xl font-semibold">
				{currentExerciseName}
			</Text>
			<Button
				variant="ghost"
				size="icon"
				disabled={nextButtonDisabled}
				onPress={onGoToNext}
				className="shrink-0"
			>
				<ChevronRight className="text-foreground" />
			</Button>
		</View>
	);
});
