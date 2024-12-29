import { View } from "react-native";
import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";
import ExerciseCardBadge from "./exercise-card-badge";

export default function ExerciseRepsAndSetsDetails({
	reps = 0,
	sets = 0,
	durationPerRepSeconds = 0
}: {
	reps?: number;
	sets?: number;
	durationPerRepSeconds?: number;
}) {
	return (
		<View className="flex flex-row flex-wrap gap-1">
			{sets > 0 ? (
				<ExerciseCardBadge
					boldedText={sets.toString()}
					text={"set(s)"}
				/>
			) : null}
			{reps > 0 && sets > 0 ? <Text className="text-lg"> × </Text> : null}
			{reps > 0 ? (
				<ExerciseCardBadge
					boldedText={reps.toString()}
					text={"rep(s)"}
				/>
			) : null}
			{(sets > 0 || reps > 0) && durationPerRepSeconds > 0 ? (
				<Text className="text-lg"> × </Text>
			) : null}
			{durationPerRepSeconds > 0 ? (
				<ExerciseCardBadge
					boldedText={formatDuration(durationPerRepSeconds * 1000)}
					text={"per rep"}
					variant="secondary"
				/>
			) : null}
		</View>
	);
}
