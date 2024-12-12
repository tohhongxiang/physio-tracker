import { WorkoutFormSchemaType } from "../schema";
import ConfirmWorkoutDetailsForm from "./confirm-workout-details-form";
import { FormStepProps } from "./form-step-props";
import WorkoutDetailsForm from "./workout-details-form";
import WorkoutExerciseDetailsForm from "./workout-exercise-details-form";

export const formSteps: {
	component: (props: FormStepProps) => JSX.Element;
	validate?: (keyof WorkoutFormSchemaType)[];
}[] = [
	{ component: WorkoutDetailsForm, validate: ["name", "description"] },
	{ component: WorkoutExerciseDetailsForm, validate: ["exercises"] },
	{ component: ConfirmWorkoutDetailsForm }
];
