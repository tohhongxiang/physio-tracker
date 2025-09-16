import { usePreventRemove } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { useAlertDialog } from "~/providers/alert-dialog-provider";
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
	const alert = useAlertDialog();

	const form = useWorkoutForm(data);
	usePreventRemove(
		form.formState.isDirty &&
			!form.formState.isSubmitting &&
			!form.formState.isSubmitted, // when submitting, we can allow redirects
		({ data }) => {
			if (step > 0) {
				setStep((c) => c - 1);
				return;
			}

			alert({
				title: "Discard Changes?",
				description:
					"You have unsaved changes. Discard them and leave?",
				variant: "destructive",
				actionText: "Discard",
				onSuccess: () => navigator.dispatch(data.action)
			});
		}
	);

	const [step, setStep] = useState(0);
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
