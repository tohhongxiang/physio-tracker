import { useQuery } from "@tanstack/react-query";
import { Link, useNavigation } from "expo-router";
import { Keyboard, View } from "react-native";
import getWorkouts from "~/api/get-workouts";
import { Button } from "~/components/ui/button";
import WorkoutsList from "~/components/workouts-list";
import { Text } from "~/components/ui/text";
import { Plus } from "~/lib/icons/Plus";
import { useEffect, useRef } from "react";
import { SlidersHorizontal } from "~/lib/icons/SlidersHorizontal";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import SearchFiltersForm from "~/components/search-filters-form";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { WorkoutFilters } from "~/types";

export default function WorkoutList() {
	const searchParams = useLocalSearchParams<WorkoutFilters>();
	const { data, isPending, isRefetching, refetch } = useQuery({
		queryKey: ["workouts", searchParams],
		queryFn: () => getWorkouts(searchParams),
		refetchOnMount: false // prevent race condition where workout is created, but exercise is not created
	});

	const bottomSheetRef = useRef<BottomSheet>(null);
	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button
					variant="ghost"
					size="icon"
					className="aspect-square p-0"
					onPress={() => bottomSheetRef.current?.expand()}
				>
					<SlidersHorizontal className="text-primary" size={23} />
				</Button>
			)
		});
	}, [navigation]);

	function handleSearchFiltersConfirm() {
		Keyboard.dismiss();
		bottomSheetRef.current?.close();
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

			<BottomSheet
				ref={bottomSheetRef}
				enablePanDownToClose
				index={-1}
				handleComponent={() => (
					<View className="flex items-center justify-center rounded-t-xl border border-b-0 border-input bg-popover pt-4">
						<View className="h-1 w-16 rounded-md bg-muted-foreground" />
					</View>
				)}
				backgroundComponent={null}
			>
				<BottomSheetView className="flex flex-col gap-4 bg-popover p-8">
					<SearchFiltersForm onConfirm={handleSearchFiltersConfirm} />
				</BottomSheetView>
			</BottomSheet>
		</View>
	);
}
