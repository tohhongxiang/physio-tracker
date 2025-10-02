import { useMutation } from "@tanstack/react-query";

import deleteAll from "~/api/delete-all";
import restoreBackup from "~/api/restore-backup";
import { ExportData } from "~/types";

export default function useRestoreBackup({
	onSuccess,
	onError
}: {
	onSuccess?: (
		restoredData: Awaited<ReturnType<typeof restoreBackup>>
	) => void;
	onError?: (error: Error) => void;
} = {}) {
	const { isPending, mutateAsync, error } = useMutation({
		mutationFn: async (data: ExportData) => {
			await new Promise<void>((res) => setTimeout(() => res(), 1000));
			await deleteAll();
			return restoreBackup(data);
		},
		onSuccess: (data) => {
			onSuccess?.(data);
		},
		onError
	});

	return { isLoading: isPending, restoreBackup: mutateAsync, error };
}
