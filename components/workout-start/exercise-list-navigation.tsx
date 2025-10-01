import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { memo } from "react";
import { View } from "react-native";

import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";

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
				<Icon as={ChevronLeft} className="text-foreground h-6 w-6" />
			</Button>
			<Text
				className="line-clamp-1 flex shrink text-center text-2xl font-semibold"
				numberOfLines={1}
			>
				{currentExerciseName}
			</Text>
			<Button
				variant="ghost"
				size="icon"
				disabled={nextButtonDisabled}
				onPress={onGoToNext}
				className="shrink-0"
			>
				<Icon as={ChevronRight} className="text-foreground h-6 w-6" />
			</Button>
		</View>
	);
});
