import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Exercise } from "~/types";
import ExerciseRepsAndSetsDetails from "./exercise-reps-and-sets-details";
import ExerciseRestDetails from "./exercise-rest-details";
import ReadMoreText from "~/components/read-more-text";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
	return (
		<View
			key={exercise.id}
			className="flex flex-col gap-6 rounded-md border border-muted-foreground/30 p-4"
		>
			<View>
				<Text className="text-xl font-bold">{exercise.name}</Text>
				{exercise.description.length > 0 ? (
					<ReadMoreText
						text={exercise.description}
						className="text-muted-foreground"
					/>
				) : null}
			</View>
			<View className="flex flex-col gap-2">
				<ExerciseRepsAndSetsDetails
					reps={exercise.reps}
					sets={exercise.sets}
					durationPerRepSeconds={exercise.durationPerRepSeconds}
				/>
				<ExerciseRestDetails
					restBetweenRepsSeconds={exercise.restBetweenRepsSeconds}
					restBetweenSetsSeconds={exercise.restBetweenSetsSeconds}
				/>
			</View>
		</View>
	);
}
