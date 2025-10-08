import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { WorkoutFormInput, WorkoutFormSchema } from "./schema";

export default function useWorkoutForm(data?: WorkoutFormInput) {
	return useForm({
		resolver: zodResolver(WorkoutFormSchema),
		values: data,
		defaultValues: {
			name: "",
			description: "",
			exercises: []
		}
	});
}
