import WorkoutDetails from "~/components/workout-details";
import { Workout } from "~/types";
import { FormStepProps } from "./form-step-props";

export default function ConfirmWorkoutDetailsForm({ value }: FormStepProps) {
	return <WorkoutDetails workout={value as Workout} showTitle />;
}
