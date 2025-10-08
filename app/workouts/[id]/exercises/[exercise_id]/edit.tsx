import { useLocalSearchParams, useNavigation } from "expo-router";
import { View } from "react-native";
import { toast } from "sonner-native";

import NotFound from "~/components/not-found";
import SingleExerciseForm from "~/components/workout-form/workout-exercises/single-exercise-form";
import { Exercise } from "~/db/dto";
import useEditExercise from "~/hooks/api/use-edit-exercise";
import useGetExercise from "~/hooks/api/use-get-exercise";

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
		return <SingleExerciseForm.Loading />;
	}

	if (!data) {
		return (
			<NotFound
				title="Exercise not found"
				text="This exercise was not found"
			/>
		);
	}

	return (
		<View className="flex-1">
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
