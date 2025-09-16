import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { WorkoutFormSchema, WorkoutFormSchemaType } from "./schema";

export default function useWorkoutForm(data?: WorkoutFormSchemaType) {
	return useForm<WorkoutFormSchemaType>({
		resolver: zodResolver(WorkoutFormSchema),
		values: data,
		defaultValues: {
			name: "",
			description: "",
			exercises: []
		}
	});
}
