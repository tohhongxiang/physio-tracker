import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";

import updateWorkoutSettings from "~/api/update-workout-settings";
import { UpdateWorkoutSettings } from "~/db/dto";

export default function useUpdateWorkoutSettings({
	onSuccess,
	onError
}: {
	onSuccess?: (
		data: Awaited<ReturnType<typeof updateWorkoutSettings>>
	) => void;
	onError?: (error: Error) => void;
} = {}) {
	const { isPending, mutate, error } = useMutation({
		mutationFn: (updates: UpdateWorkoutSettings) =>
			updateWorkoutSettings(updates),
		onSuccess: (updatedSettings) => {
			onSuccess?.(updatedSettings);
		},
		onError: (error: Error) => {
			toast.error("Failed to update settings: " + error.message);
			onError?.(error);
		}
	});

	return { isLoading: isPending, updateWorkoutSettings: mutate, error };
}
