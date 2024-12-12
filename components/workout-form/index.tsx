import { usePreventRemove } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import ConfirmDialog from "~/components/confirm-dialog";
import { WorkoutFormSchemaType } from "./schema";
import useWorkoutForm from "./use-workout-form";
import { formSteps } from "./form-steps";

export default function WorkoutForm({
	data,
	onSubmit
}: {
	data?: WorkoutFormSchemaType;
	onSubmit?: (data: WorkoutFormSchemaType) => unknown;
}) {
	const [step, setStep] = useState(0);

	const navigator = useNavigation();
	const [discardChangesDialogOpen, setDiscardChangesDialogOpen] =
		useState(false);
	const [preventRemove, setPreventRemove] = useState(true);
	usePreventRemove(preventRemove, ({ data }) => {
		if (step > 0) {
			setStep((c) => c - 1);
			return;
		}

		if (!isDirty) {
			navigator.dispatch(data.action);
			return;
		}

		setDiscardChangesDialogOpen(true);
	});

	async function handleConfirmLeavePage() {
		setPreventRemove(false);
		setTimeout(() => navigator.goBack(), 0);
	}

	const {
		control,
		handleSubmit,
		formState: { errors, isDirty },
		getValues,
		trigger
	} = useWorkoutForm(data);

	function handleGoToPreviousStep() {
		if (step === 0) {
			navigator.goBack();
			return;
		}

		setStep((current) => current - 1);
	}
	async function handleGoToNextStep() {
		if (step === formSteps.length - 1) {
			// final step, submit
			handleSubmit(
				(data) => {
					onSubmit?.(data);
				},
				(errors) => {
					console.log(
						"Errors in submitting:",
						JSON.stringify(errors, null, 2)
					);
				}
			)();
			return;
		}

		// if we need to validate from the current step
		if (formSteps[step].validate) {
			const isValid = await trigger(formSteps[step].validate, {
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
		<View className="flex flex-1 flex-col gap-4 p-4">
			{
				<CurrentStepUI
					value={getValues()}
					control={control}
					errors={errors}
				/>
			}
			<View className="flex shrink-0 flex-row justify-end gap-4">
				<Button variant="secondary" onPress={handleGoToPreviousStep}>
					<Text>{step === 0 ? "Cancel" : "Previous"}</Text>
				</Button>
				<Button onPress={handleGoToNextStep}>
					<Text>
						{step === formSteps.length - 1 ? "Finish" : "Next"}
					</Text>
				</Button>
			</View>
			<ConfirmDialog
				title="Discard changes?"
				description="You have unsaved changes. Discard them and leave the screen?"
				variant="destructive"
				confirmText="Discard"
				onConfirm={handleConfirmLeavePage}
				open={discardChangesDialogOpen}
				onOpenChange={setDiscardChangesDialogOpen}
			/>
		</View>
	);
}
