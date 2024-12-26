import { usePreventRemove } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { WorkoutFormSchemaType } from "./schema";
import useWorkoutForm from "./use-workout-form";
import { formSteps } from "./form-steps";
import { Workout } from "~/types";
import { useAlertDialog } from "~/providers/alert-dialog-provider";

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
	const [step, setStep] = useState(0);

	const navigator = useNavigation();
	const alert = useAlertDialog();
	const form = useWorkoutForm(data);

	usePreventRemove(form.formState.isDirty, ({ data }) => {
		if (step > 0) {
			setStep((c) => c - 1);
			return;
		}

		if (!form.formState.isDirty) {
			navigator.dispatch(data.action);
			return;
		}

		alert({
			title: "Discard Changes?",
			description:
				"You have unsaved changes. Discard them and leave the screen?",
			variant: "destructive",
			actionText: "Discard",
			onSuccess: () => navigator.dispatch(data.action)
		});
	});

	function handleGoToPreviousStep() {
		if (step === 0) {
			navigator.goBack();
			return;
		}

		setStep((current) => current - 1);
	}

	const [isSubmitting, setIsSubmitting] = useState(false);
	async function handleGoToNextStep() {
		if (step === formSteps.length - 1) {
			// final step, submit
			form.handleSubmit(async (data) => {
				setIsSubmitting(true);
				await onSubmit?.(data as Workout);
				setIsSubmitting(false);
			})();
			return;
		}

		// if we need to validate from the current step
		if (formSteps[step].validate) {
			const isValid = await form.trigger(formSteps[step].validate, {
				shouldFocus: true
			});

			if (!isValid) {
				return;
			}
		}

		setStep((current) => current + 1);
	}

	const CurrentStepUI = formSteps[step].component;
	return (
		<View className="flex flex-1 flex-col p-4">
			<View className="flex-1">
				<CurrentStepUI form={form} />
			</View>
			<View className="flex shrink-0 flex-row justify-end gap-4 pt-4">
				<Button variant="secondary" onPress={handleGoToPreviousStep}>
					<Text>{step === 0 ? "Cancel" : "Previous"}</Text>
				</Button>
				<Button onPress={handleGoToNextStep} disabled={isSubmitting}>
					<Text>
						{isSubmitting
							? "Submitting..."
							: step === formSteps.length - 1
								? "Finish"
								: "Next"}
					</Text>
				</Button>
			</View>
		</View>
	);
}
