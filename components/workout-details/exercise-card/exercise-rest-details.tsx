import { View } from "react-native";
import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";
import ExerciseCardBadge from "./exercise-card-badge";

export default function ExerciseRestDetails({
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
			<Text className="text-lg">Rest </Text>
			{restBetweenRepsSeconds > 0 && (
				<ExerciseCardBadge
					boldedText={formatDuration(restBetweenRepsSeconds * 1000)}
					text={"per rep"}
					variant="secondary"
				/>
			)}
			{restBetweenRepsSeconds > 0 && restBetweenSetsSeconds > 0 && (
				<Text className="text-lg text-secondary-foreground"> , </Text>
			)}
			{restBetweenSetsSeconds > 0 && (
				<ExerciseCardBadge
					boldedText={formatDuration(restBetweenSetsSeconds * 1000)}
					text={"per set"}
					variant="secondary"
				/>
			)}
		</View>
	);
}
