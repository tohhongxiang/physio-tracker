import { View } from "react-native";
import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";
import ExerciseDetailBadge from "~/components/exercise-detail-badges/exercise-detail-badge";
import { memo } from "react";

export default memo(function ExerciseRestDetails({
	restBetweenRepsSeconds = 0,
	restBetweenSetsSeconds = 0
}: {
	restBetweenRepsSeconds?: number;
	restBetweenSetsSeconds?: number;
}) {
	if (!restBetweenRepsSeconds && !restBetweenSetsSeconds) {
		return null;
	}

	return (
		<View className="flex flex-row">
			<Text className="text-md">Rest </Text>
			{restBetweenRepsSeconds > 0 && (
				<ExerciseDetailBadge
					boldedText={formatDuration(restBetweenRepsSeconds * 1000)}
					text={"per rep"}
					variant="secondary"
				/>
			)}
			{restBetweenRepsSeconds > 0 && restBetweenSetsSeconds > 0 && (
				<Text className="text-md text-secondary-foreground"> , </Text>
			)}
			{restBetweenSetsSeconds > 0 && (
				<ExerciseDetailBadge
					boldedText={formatDuration(restBetweenSetsSeconds * 1000)}
					text={"per set"}
					variant="secondary"
				/>
			)}
		</View>
	);
});
