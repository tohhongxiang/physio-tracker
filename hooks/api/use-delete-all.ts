import { useMutation } from "@tanstack/react-query";

import deleteAll from "~/api/delete-all";

export default function useDeleteAll({
	onSuccess,
	onError
}: {
	onSuccess?: (deleteResult: Awaited<ReturnType<typeof deleteAll>>) => void;
	onError?: (error: Error) => void;
} = {}) {
	const { isPending, mutateAsync, error } = useMutation({
		mutationFn: deleteAll,
		onSuccess: (deleteResult) => {
			onSuccess?.(deleteResult);
		},
		onError
	});

	return { isLoading: isPending, deleteAll: mutateAsync, error };
}
