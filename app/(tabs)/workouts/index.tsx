import { Link, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Keyboard, View } from "react-native";

import BottomSheetModal from "~/components/bottom-sheet-modal";
import Pagination from "~/components/pagination";
import SearchFiltersForm from "~/components/search-filters-form";
import { ThemeToggle } from "~/components/theme-toggle";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import WorkoutsList from "~/components/workouts-list";
import useGetWorkouts from "~/hooks/api/use-get-workouts";
import { useBottomSheet } from "~/hooks/use-bottom-sheet";
import usePageParams from "~/hooks/use-page-params";
import useWorkoutFilterParams from "~/hooks/use-workout-filter-params";
import { Plus } from "~/lib/icons/Plus";
import { SlidersHorizontal } from "~/lib/icons/SlidersHorizontal";
import { WorkoutFilters } from "~/types";

export default function WorkoutList() {
	const {
		isSearchFilterModified,
		filters,
		setSearchParams,
		resetSearchParams
	} = useWorkoutFilterParams();

	const { page, goToNextPage, goToPreviousPage, setPage } = usePageParams();

	const {
		data: { count, data } = { count: 0, data: [] },
		isPending,
		isRefetching,
		refetch
	} = useGetWorkouts({ ...filters, page });

	const bottomSheet = useBottomSheet();
	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View className="flex flex-row items-center gap-4">
					<Button
						variant={"ghost"}
						size="icon"
						className="aspect-square p-0"
						onPress={() => bottomSheet.open()}
					>
						<SlidersHorizontal
							className="text-foreground"
							size={23}
						/>
						{isSearchFilterModified ? (
							<Badge
								variant="destructive"
								className="absolute right-0 top-1 h-3 w-3 rounded-full p-0"
							/>
						) : null}
					</Button>
					<ThemeToggle />
				</View>
			)
		});
	}, [navigation, filters, isSearchFilterModified, bottomSheet]);

	function handleSearchFiltersConfirm(updatedParams: WorkoutFilters) {
		setSearchParams(updatedParams);
		setPage(0);

		Keyboard.dismiss();
		bottomSheet.close();
	}

	function handleResetSearchParams() {
		resetSearchParams();
		setPage(0);
	}

	if (isPending) {
		return <WorkoutsList.Loading />;
	}

	const workouts = data ?? [];
	return (
		<View className="flex flex-1 flex-col">
			<View className="p-4">
				<Link href="/(modals)/workouts/add" asChild>
					<Button className="flex flex-row items-center justify-center gap-4">
						<Plus className="text-primary-foreground" />
						<Text>Add Workout</Text>
					</Button>
				</Link>
			</View>
			<WorkoutsList
				workouts={workouts}
				refreshing={isRefetching}
				onRefresh={refetch}
				ListFooterComponentClassName="pt-8"
				ListFooterComponent={
					workouts.length > 0 ? (
						<Pagination
							currentPage={page}
							onGoToNextPage={goToNextPage}
							onGoToPreviousPage={goToPreviousPage}
							onGoToPage={setPage}
							dataCount={count}
							pageLimit={filters.limit}
						/>
					) : null
				}
			/>
			<BottomSheetModal
				ref={bottomSheet.ref}
				onChange={bottomSheet.onChange}
			>
				<SearchFiltersForm
					onConfirm={handleSearchFiltersConfirm}
					onReset={handleResetSearchParams}
					filters={filters}
				/>
			</BottomSheetModal>
		</View>
	);
}
