import { useLocalSearchParams, useNavigation } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import SingleExerciseForm from "~/components/workout-form/workout-exercises/single-exercise-form";
import useEditExercise from "~/hooks/api/use-edit-exercise";
import useGetExercise from "~/hooks/api/use-get-exercise";
import { Exercise } from "~/types";
import { toast } from "sonner-native";

export default function EditExercise() {
	const { id: workoutId, exercise_id: exerciseId } = useLocalSearchParams<{
		id: string;
		exercise_id: string;
	}>();

	const { data, isPending } = useGetExercise({
		workoutId: parseInt(workoutId),
		exerciseId: parseInt(exerciseId)
	});

	const { editExercise } = useEditExercise({
		onSuccess: () => navigator.goBack(),
		onError: (error) => {
			toast.error(error.message);
		}
	});

	const navigator = useNavigation();

	const handleCancel = () => {
		navigator.goBack();
	};

	const handleSubmit = (updatedExercise: Exercise) => {
		editExercise({
			workoutId: parseInt(workoutId),
			exerciseId: parseInt(exerciseId),
			exercise: updatedExercise
		});
	};

	if (isPending) {
		return (
			<View>
				<Text>Loading</Text>
			</View>
		);
	}

	if (!data) {
		return (
			<View>
				<Text>No data</Text>
			</View>
		);
	}

	return (
		<View>
			<SingleExerciseForm
				isOpen
				showHeader={false}
				initialData={data}
				onCancel={handleCancel}
				onSubmit={handleSubmit}
			/>
		</View>
	);
}
