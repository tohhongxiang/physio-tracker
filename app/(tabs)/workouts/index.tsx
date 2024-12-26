import { useQuery } from "@tanstack/react-query";
import { Link, useFocusEffect, useNavigation } from "expo-router";
import { Keyboard, View } from "react-native";
import getWorkouts from "~/api/get-workouts";
import { Button } from "~/components/ui/button";
import WorkoutsList from "~/components/workouts-list";
import { Text } from "~/components/ui/text";
import { Plus } from "~/lib/icons/Plus";
import { useCallback, useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "~/lib/icons/SlidersHorizontal";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import SearchFiltersForm from "~/components/search-filters-form";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { WorkoutFilters } from "~/types";
import { Badge } from "~/components/ui/badge";

export default function WorkoutList() {
	const searchParams = useLocalSearchParams<WorkoutFilters>();
	const { data, isPending, isRefetching, refetch } = useQuery({
		queryKey: ["workouts", searchParams],
		queryFn: () => getWorkouts(searchParams),
		refetchOnMount: false // prevent race condition where workout is created, but exercise is not created
	});

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	useFocusEffect(
		// close bottom sheet if leaving page
		useCallback(() => {
			return () => bottomSheetModalRef.current?.close();
		}, [])
	);

	const navigation = useNavigation();
	useEffect(() => {
		const isFilterActive = searchParams.search || searchParams.sortBy;

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
					{isFilterActive ? (
						<Badge
							variant="destructive"
							className="absolute right-0 top-1 h-3 w-3 rounded-full p-0"
						/>
					) : null}
				</Button>
			)
		});
	}, [navigation, searchParams, isBottomSheetOpen]);

	function handleSearchFiltersConfirm() {
		Keyboard.dismiss();
		bottomSheetModalRef.current?.close();
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
			>
				<BottomSheetView className="flex flex-col gap-4 bg-popover p-8">
					<SearchFiltersForm
						onConfirm={handleSearchFiltersConfirm}
						filters={searchParams}
					/>
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
}
