import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";

import { WorkoutFilters } from "~/db/dto";

export const DEFAULT_LIMIT = 50;
export default function useWorkoutFilterParams() {
	const searchParams =
		useLocalSearchParams<{ [K in keyof WorkoutFilters]: string }>();

	const search = searchParams.search ?? "";
	const sortBy = (searchParams.sortBy ?? "") as WorkoutFilters["sortBy"];
	const limit = searchParams.limit
		? parseInt(searchParams.limit)
		: DEFAULT_LIMIT;

	const isSearchFilterModified =
		search !== "" || sortBy !== "" || limit !== DEFAULT_LIMIT;

	const setSearchParams = useCallback(
		(updated: Partial<WorkoutFilters>) => {
			const finalParams = { search, sortBy, limit, ...updated };
			router.setParams(finalParams);
		},
		[limit, search, sortBy]
	);

	const resetSearchParams = useCallback(() => {
		router.setParams({
			...searchParams,
			search: "",
			sortBy: "",
			limit: DEFAULT_LIMIT
		});
	}, [searchParams]);

	const finalSearchParams = useMemo(
		() => ({
			search,
			sortBy,
			limit
		}),
		[limit, search, sortBy]
	);

	return {
		isSearchFilterModified,
		filters: finalSearchParams,
		setSearchParams,
		resetSearchParams
	};
}
