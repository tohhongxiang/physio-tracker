import { View } from "react-native";
import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";
import ExerciseCardBadge from "./exercise-card-badge";

export default function ExerciseRepsAndSetsDetails({
	reps,
	sets,
	durationPerRepSeconds = 0
}: {
	reps: number;
	sets: number;
	durationPerRepSeconds?: number;
}) {
	return (
		<View className="flex flex-row flex-wrap gap-1">
			<ExerciseCardBadge boldedText={sets.toString()} text={"set(s)"} />
			<Text className="text-lg"> × </Text>
			<ExerciseCardBadge boldedText={reps.toString()} text={"rep(s)"} />
			{durationPerRepSeconds > 0 ? (
				<>
					<Text className="text-lg"> × </Text>
					<ExerciseCardBadge
						boldedText={formatDuration(
							durationPerRepSeconds * 1000
						)}
						text={"per rep"}
						variant="secondary"
					/>
				</>
			) : null}
		</View>
	);
}
