import { View } from "react-native";
import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";
import ExerciseCardBadge from "./exercise-card-badge";

export default function ExerciseRepsAndSetsDetails({
	repsPerSet,
	sets,
	durationPerRepSeconds
}: {
	repsPerSet: number;
	sets: number;
	durationPerRepSeconds?: number;
}) {
	return (
		<View className="flex flex-row">
			<ExerciseCardBadge boldedText={sets.toString()} text={"set(s)"} />
			<Text className="text-lg"> × </Text>
			<ExerciseCardBadge
				boldedText={repsPerSet.toString()}
				text={"rep(s)"}
			/>
			{durationPerRepSeconds ? (
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
