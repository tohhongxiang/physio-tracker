import { memo } from "react";
import { View } from "react-native";

import ExerciseDetailBadge from "~/components/exercise-detail-badges/exercise-detail-badge";
import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";

export default memo(function ExerciseEffortDetails({
	reps = 0,
	sets = 0,
	weight = 0,
	weightUnit = "kg",
	durationPerRepSeconds = 0
}: {
	reps?: number;
	sets?: number;
	weight?: number;
	weightUnit?: "kg" | "lbs" | "%BW";
	durationPerRepSeconds?: number;
}) {
	return (
		<View className="flex flex-row flex-wrap items-center gap-1">
			{sets > 0 ? (
				<ExerciseDetailBadge
					variant="accent"
					boldedText={sets.toString()}
					text={"set(s)"}
				/>
			) : null}
			{reps > 0 && sets > 0 ? <Text className="text-lg"> × </Text> : null}
			{reps > 0 ? (
				<ExerciseDetailBadge
					variant="accent"
					boldedText={reps.toString()}
					text={"rep(s)"}
				/>
			) : null}
			{(sets > 0 || reps > 0) && weight > 0 ? (
				<Text className="text-lg"> × </Text>
			) : null}
			{weight > 0 ? (
				<ExerciseDetailBadge
					variant="accent"
					boldedText={weight.toString()}
					text={weightUnit}
				/>
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
