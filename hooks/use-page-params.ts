import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

export type PageParams = {
	page: number;
};

export default function usePageParams() {
	const pageParams = useLocalSearchParams<{ page?: string }>();
	const page = parseInt(pageParams.page ?? "0");

	const setPage = useCallback((page: number) => {
		router.setParams({ page });
	}, []);

	const goToNextPage = useCallback(() => {
		router.setParams({ page: page + 1 });
	}, [page]);

	const goToPreviousPage = useCallback(() => {
		router.setParams({ page: page - 1 });
	}, [page]);

	return { page, setPage, goToNextPage, goToPreviousPage };
}
