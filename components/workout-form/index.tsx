import { usePreventRemove } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import useDeleteAlert from "~/hooks/use-delete-alert";
import { Workout } from "~/types";

import ConfirmWorkout from "./confirm-workout";
import { WorkoutFormSchemaType } from "./schema";
import useWorkoutForm from "./use-workout-form";
import WorkoutExercises from "./workout-exercises";
import WorkoutInformation from "./workout-information";

type WorkoutFormProps =
	| {
			data: Workout;
			onSubmit: (data: Workout) => unknown;
	  }
	| {
			data?: never;
			onSubmit: (data: WorkoutFormSchemaType) => unknown;
	  };

export default function WorkoutForm({ data, onSubmit }: WorkoutFormProps) {
	const navigator = useNavigation();
	const alert = useDeleteAlert();

	const [step, setStep] = useState(0);
	const form = useWorkoutForm(data);
	usePreventRemove(true, ({ data }) => {
		const { action } = data;
		const { isSubmitted, isDirty } = form.formState;

		if (isSubmitted) {
			navigator.dispatch(action);
		} else if (step > 0) {
			setStep((c) => c - 1);
		} else if (isDirty) {
			alert({
				title: "Discard Changes?",
				description:
					"You have unsaved changes. Discard them and leave?",
				actionText: "Discard",
				loadingText: "Discarding",
				onSuccess: () => navigator.dispatch(action)
			});
		} else {
			navigator.dispatch(action);
		}
	});

	function handleGoToPreviousStep() {
		if (step === 0) {
			navigator.goBack();
			return;
		}

		setStep((current) => current - 1);
	}

	function handleSubmit() {
		form.handleSubmit(async (data) => {
			await onSubmit?.(data as Workout);
		})();
	}

	return (
		<View className="flex-1">
			{step === 0 ? (
				<WorkoutInformation
					form={form}
					onSuccessfulSubmit={() => setStep((c) => c + 1)}
					onGoToPreviousStep={handleGoToPreviousStep}
				/>
			) : null}
			{step === 1 ? (
				<WorkoutExercises
					form={form}
					onSuccessfulSubmit={() => setStep((c) => c + 1)}
					onGoToPreviousStep={handleGoToPreviousStep}
				/>
			) : null}
			{step === 2 ? (
				<ConfirmWorkout
					workout={form.getValues() as Workout}
					onGoToPreviousStep={handleGoToPreviousStep}
					onSuccessfulSubmit={handleSubmit}
					isSubmitting={form.formState.isSubmitting}
				/>
			) : null}
		</View>
	);
}
