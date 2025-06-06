import { View } from "react-native";
import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";
import ExerciseDetailBadge from "~/components/exercise-detail-badges/exercise-detail-badge";
import { memo } from "react";

export default memo(function ExerciseEffortDetails({
	reps = 0,
	sets = 0,
	weight = 0,
	durationPerRepSeconds = 0
}: {
	reps?: number;
	sets?: number;
	weight?: number;
	durationPerRepSeconds?: number;
}) {
	return (
		<View className="flex flex-row flex-wrap items-center gap-1">
			{sets > 0 ? (
				<ExerciseDetailBadge
					boldedText={sets.toString()}
					text={"set(s)"}
				/>
			) : null}
			{reps > 0 && sets > 0 ? <Text className="text-lg"> × </Text> : null}
			{reps > 0 ? (
				<ExerciseDetailBadge
					boldedText={reps.toString()}
					text={"rep(s)"}
				/>
			) : null}
			{(sets > 0 || reps > 0) && weight > 0 ? (
				<Text className="text-lg"> × </Text>
			) : null}
			{weight > 0 ? (
				<ExerciseDetailBadge boldedText={weight.toString()} text="kg" />
			) : null}
			{(sets > 0 || reps > 0 || weight > 0) &&
			durationPerRepSeconds > 0 ? (
				<Text className="text-lg"> × </Text>
			) : null}
			{durationPerRepSeconds > 0 ? (
				<ExerciseDetailBadge
					boldedText={formatDuration(durationPerRepSeconds * 1000)}
					text={"per rep"}
					variant="secondary"
				/>
			) : null}
		</View>
	);
});
