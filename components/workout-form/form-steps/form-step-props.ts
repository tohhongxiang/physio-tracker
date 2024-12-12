import { Control, FieldErrors } from "react-hook-form";
import { WorkoutFormSchemaType } from "../schema";

export interface FormStepProps {
	value: WorkoutFormSchemaType;
	control: Control<WorkoutFormSchemaType>;
	errors: FieldErrors<WorkoutFormSchemaType>;
}
