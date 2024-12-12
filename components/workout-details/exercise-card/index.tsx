import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Exercise } from "~/types";
import ExerciseRepsAndSetsDetails from "./exercise-reps-and-sets-details";
import ExerciseRestDetails from "./exercise-rest-details";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
	return (
		<View
			key={exercise.id}
			className="flex flex-col gap-4 rounded-md border border-muted-foreground/30 p-4"
		>
			<Text className="text-xl font-bold">{exercise.name}</Text>
			{exercise.description.length > 0 ? (
				<Text className="text-lg text-muted-foreground">
					{exercise.description}
				</Text>
			) : null}
			<ExerciseRepsAndSetsDetails
				repsPerSet={exercise.repsPerSet}
				sets={exercise.sets}
				durationPerRepSeconds={exercise.durationPerRepSeconds}
			/>
			<ExerciseRestDetails
				restBetweenRepsSeconds={exercise.restBetweenRepsSeconds}
				restBetweenSetsSeconds={exercise.restBetweenSetsSeconds}
			/>
		</View>
	);
}
