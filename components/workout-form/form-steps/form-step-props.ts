import { UseFormReturn } from "react-hook-form";
import { WorkoutFormSchemaType } from "../schema";

export interface FormStepProps {
	form: UseFormReturn<WorkoutFormSchemaType>;
}
