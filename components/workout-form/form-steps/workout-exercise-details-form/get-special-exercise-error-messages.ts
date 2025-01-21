import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { WorkoutFormSchemaType } from "../../schema";

// special errors refer to error messages that cannot be displayed on the form (due to lack of space). These are extracted to be displayed separately
export default function getSpecialExerciseErrorMessages(
	error?: Merge<
		FieldError,
		FieldErrorsImpl<WorkoutFormSchemaType["exercises"][number]>
	>
) {
	if (!error) return [];
	const specialErrors = [
		error.sets?.message,
		error.reps?.message,
		error.durationPerRepSeconds?.message,
		error.restBetweenRepsSeconds?.message,
		error.restBetweenSetsSeconds?.message
	];
	return specialErrors.filter(Boolean) as string[];
}
