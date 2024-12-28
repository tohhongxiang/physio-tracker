import { useQuery } from "@tanstack/react-query";
import { Link, useFocusEffect, useNavigation } from "expo-router";
import { Keyboard, View } from "react-native";
import getWorkouts from "~/api/get-workouts";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Plus } from "~/lib/icons/Plus";
import { useCallback, useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "~/lib/icons/SlidersHorizontal";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView
} from "@gorhom/bottom-sheet";
import SearchFiltersForm from "~/components/search-filters-form";
import { Badge } from "~/components/ui/badge";
import useWorkoutFilterParams from "~/hooks/use-workout-filter-params";
import { WorkoutFilters } from "~/types";
import usePageParams from "~/hooks/use-page-params";
import Pagination from "~/components/pagination";
import WorkoutsList from "~/components/workouts-list";
import { workoutQueryKeys } from "~/hooks/api/query-keys";

export default function WorkoutList() {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	useFocusEffect(
		useCallback(() => {
			// close bottom sheet if leaving page
			return () => bottomSheetModalRef.current?.close();
		}, [])
	);

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
	} = useQuery({
		queryKey: workoutQueryKeys.list({ ...filters, page }),
		queryFn: () => getWorkouts({ ...filters, page }),
		refetchOnMount: false // prevent race condition where workout is created, but exercise is not created
	});

	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button
					variant={"ghost"}
					size="icon"
					className="aspect-square p-0"
					onPress={() =>
						isBottomSheetOpen
							? bottomSheetModalRef.current?.close()
							: bottomSheetModalRef.current?.present()
					}
				>
					<SlidersHorizontal className={"text-primary"} size={23} />
					{isSearchFilterModified ? (
						<Badge
							variant="destructive"
							className="absolute right-0 top-1 h-3 w-3 rounded-full p-0"
						/>
					) : null}
				</Button>
			)
		});
	}, [navigation, filters, isBottomSheetOpen, isSearchFilterModified]);

	function handleSearchFiltersConfirm(updatedParams: WorkoutFilters) {
		setSearchParams(updatedParams);
		setPage(0);

		Keyboard.dismiss();
		bottomSheetModalRef.current?.close();
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
					<Pagination
						currentPage={page}
						onGoToNextPage={goToNextPage}
						onGoToPreviousPage={goToPreviousPage}
						onGoToPage={setPage}
						dataCount={count}
						pageLimit={filters.limit}
					/>
				}
			/>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				onChange={(index) =>
					setIsBottomSheetOpen(index < 0 ? false : true)
				}
				enablePanDownToClose
				handleComponent={() => (
					<View className="flex items-center justify-center rounded-t-xl border border-b-0 border-input bg-popover pt-4">
						<View className="h-1 w-16 rounded-md bg-muted-foreground" />
					</View>
				)}
				backgroundComponent={null}
				backdropComponent={(props) => (
					<BottomSheetBackdrop
						opacity={1}
						pressBehavior={"close"}
						disappearsOnIndex={-1}
						style={{
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							height: "100%",
							width: "100%"
						}}
						{...props}
					/>
				)}
			>
				<BottomSheetView className="flex flex-col gap-4 bg-popover p-8">
					<SearchFiltersForm
						onConfirm={handleSearchFiltersConfirm}
						onReset={handleResetSearchParams}
						filters={filters}
					/>
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
}
