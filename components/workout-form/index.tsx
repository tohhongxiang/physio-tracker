import { Workout } from "~/types";
import { View } from "react-native";
import { useNavigation } from "expo-router";
import { useAlertDialog } from "~/providers/alert-dialog-provider";
import useWorkoutForm from "./use-workout-form";
import { useState } from "react";
import WorkoutInformation from "./workout-information";
import { usePreventRemove } from "@react-navigation/native";
import WorkoutExercises from "./workout-exercises";
import WorkoutDetails from "../workout-details";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { WorkoutFormSchemaType } from "./schema";

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
		form.formState.isDirty && !form.formState.isSubmitting, // when submitting, we can allow redirects
		({ data }) => {
			if (step === 1) {
				return;
			}

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
		return;
	}

	return (
		<View>
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
				<View className="h-full">
					<WorkoutDetails
						workout={form.getValues() as Workout}
						showTitle
					/>
					<View className="flex flex-row gap-4">
						<Button
							variant="secondary"
							className="flex-grow"
							onPress={handleGoToPreviousStep}
							disabled={form.formState.isSubmitting}
						>
							<Text>Previous</Text>
						</Button>
						<Button
							className="flex-grow"
							onPress={handleSubmit}
							disabled={form.formState.isSubmitting}
						>
							<Text>
								{form.formState.isSubmitting
									? "Loading..."
									: "Submit"}
							</Text>
						</Button>
					</View>
				</View>
			) : null}
		</View>
	);
}
