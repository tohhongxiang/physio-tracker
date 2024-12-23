import WorkoutDetails from "~/components/workout-details";
import { Workout } from "~/types";
import { FormStepProps } from "./form-step-props";

export default function ConfirmWorkoutDetailsForm({ form }: FormStepProps) {
	return <WorkoutDetails workout={form.getValues() as Workout} showTitle />;
}
