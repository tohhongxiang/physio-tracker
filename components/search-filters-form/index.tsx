import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { router, useLocalSearchParams } from "expo-router";
import { WorkoutFilters } from "~/types";

const SELECT_OPTIONS = [
	{ label: "Name", value: "name" },
	{ label: "Date created", value: "dateCreated" }
];

export default function SearchFiltersForm({
	onConfirm
}: {
	onConfirm: () => void;
}) {
	const searchParams = useLocalSearchParams<WorkoutFilters>();

	const [sortByOption, setSortByOption] = useState<
		(typeof SELECT_OPTIONS)[number] | undefined
	>(
		SELECT_OPTIONS.find((option) => option.value === searchParams.sortBy) ??
			SELECT_OPTIONS[0]
	);
	const [localSearch, setLocalSearch] = useState(searchParams.search ?? "");

	useEffect(() => {
		setSortByOption(
			SELECT_OPTIONS.find(
				(option) => option.value === searchParams.sortBy
			) ?? SELECT_OPTIONS[0]
		);
		setLocalSearch(searchParams.search ?? "");
	}, [searchParams.search, searchParams.sortBy]);

	function handleResetFilters() {
		setSortByOption(SELECT_OPTIONS[0]);
		setLocalSearch("");

		router.setParams({ search: "", sortBy: "" });
	}

	function handleConfirmFilters() {
		router.setParams({ sortBy: sortByOption?.value, search: localSearch });
		onConfirm?.();
	}

	return (
		<View>
			<View className="flex flex-col gap-2">
				<Label>Filter by Name:</Label>
				<Input
					placeholder="Search..."
					value={localSearch}
					onChangeText={setLocalSearch}
				/>
			</View>
			<View className="flex flex-col gap-2">
				<Label>Sort By:</Label>
				<Select value={sortByOption} onValueChange={setSortByOption}>
					<SelectTrigger>
						<SelectValue
							className="native:text-lg text-sm text-foreground"
							placeholder="Placeholder"
						/>
					</SelectTrigger>
					<SelectContent className="pr-4">
						{SELECT_OPTIONS.map((option) => (
							<SelectItem
								key={option.value}
								label={option.label}
								value={option.value}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</View>
			<View className="p-2" />
			<View className="flex flex-row items-center gap-4">
				<Button
					onPress={handleResetFilters}
					variant="secondary"
					className="flex-grow"
				>
					<Text>Clear All Filters</Text>
				</Button>
				<Button onPress={handleConfirmFilters} className="flex-grow">
					<Text>Apply Filters</Text>
				</Button>
			</View>
		</View>
	);
}
