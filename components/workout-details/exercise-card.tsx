import { View } from "react-native";
import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";
import hasDuration from "~/lib/has-duration";
import { Exercise } from "~/types";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
	return (
		<View
			key={exercise.id}
			className="flex flex-col gap-4 rounded-md border border-muted-foreground/30 p-4"
		>
			<Text className="text-xl font-bold">{exercise.name}</Text>
			<Text className="text-lg text-muted-foreground">
				{exercise.description}
			</Text>
			<View className="flex flex-row">
				<View className="flex flex-row items-center justify-center rounded-md bg-primary px-2 text-center">
					<Text className="text-lg font-semibold text-primary-foreground">
						{exercise.sets}
					</Text>
					<Text className="text-lg text-primary-foreground">
						{" "}
						set(s)
					</Text>
				</View>
				<Text className="text-lg"> × </Text>
				<View className="flex flex-row items-center rounded-md bg-primary px-2 text-center">
					<Text className="text-lg font-semibold text-primary-foreground">
						{exercise.repsPerSet}
					</Text>
					<Text className="text-lg text-primary-foreground">
						{" "}
						rep(s)
					</Text>
				</View>
				{hasDuration(exercise) && (
					<>
						<Text className="text-lg"> × </Text>
						<View className="flex flex-row items-center rounded-md bg-secondary px-2 text-center">
							<Text className="text-lg font-semibold text-secondary-foreground">
								{formatDuration(exercise.durationPerRepSeconds)}
							</Text>
							<Text className="text-lg text-secondary-foreground">
								{" "}
								per rep
							</Text>
						</View>
					</>
				)}
			</View>
			<ExerciseRestDetails
				restBetweenRepsSeconds={exercise.restBetweenRepsSeconds}
				restBetweenSetsSeconds={exercise.restBetweenSetsSeconds}
			/>
		</View>
	);
}

function ExerciseRestDetails({
	restBetweenRepsSeconds,
	restBetweenSetsSeconds
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
			{restBetweenRepsSeconds && (
				<>
					<View className="flex flex-row items-center rounded-md bg-secondary px-2 text-center">
						<Text className="text-lg font-semibold text-secondary-foreground">
							{formatDuration(restBetweenRepsSeconds)}
						</Text>
					</View>
					<Text className="text-lg text-secondary-foreground">
						{" "}
						per rep
					</Text>
				</>
			)}
			{restBetweenRepsSeconds && restBetweenSetsSeconds && (
				<Text className="text-lg text-secondary-foreground">, </Text>
			)}
			{restBetweenSetsSeconds && (
				<>
					<View className="flex flex-row items-center rounded-md bg-secondary px-2 text-center">
						<Text className="text-lg font-semibold text-secondary-foreground">
							{formatDuration(restBetweenSetsSeconds)}
						</Text>
					</View>
					<Text className="text-lg text-secondary-foreground">
						{" "}
						per set
					</Text>
				</>
			)}
		</View>
	);
}
