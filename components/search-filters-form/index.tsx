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
import { WorkoutFilters } from "~/types";
import { DEFAULT_LIMIT } from "~/hooks/use-workout-filter-params";

const SELECT_OPTIONS = [
	{ label: "No sort", value: "" },
	{ label: "Name", value: "name" },
	{ label: "Date created", value: "dateCreated" }
] as const;

const LIMIT_OPTIONS = [2, 10, 25, DEFAULT_LIMIT] as const;

export default function SearchFiltersForm({
	filters,
	onConfirm,
	onReset
}: {
	filters: WorkoutFilters;
	onConfirm: (filters: WorkoutFilters) => void;
	onReset: () => void;
}) {
	const [sortByOption, setSortByOption] = useState(
		SELECT_OPTIONS.find((option) => option.value === filters.sortBy) ??
			SELECT_OPTIONS[0]
	);
	const [localSearch, setLocalSearch] = useState(filters.search);
	const [limit, setLimit] = useState(filters.limit);

	useEffect(() => {
		setSortByOption(
			SELECT_OPTIONS.find((option) => option.value === filters.sortBy) ??
				SELECT_OPTIONS[0]
		);
		setLocalSearch(filters.search);
		setLimit(filters.limit);
	}, [filters.search, filters.sortBy, filters.limit]);

	function handleConfirmFilters() {
		onConfirm?.({
			sortBy: sortByOption?.value ?? "",
			search: localSearch,
			limit
		});
	}

	return (
		<View className="flex flex-col gap-4">
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
				<Select
					value={sortByOption}
					onValueChange={(option) =>
						setSortByOption(
							(option ??
								SELECT_OPTIONS[0]) as (typeof SELECT_OPTIONS)[number]
						)
					}
				>
					<SelectTrigger>
						<SelectValue
							className="native:text-lg text-sm text-foreground"
							placeholder=""
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
			<View className="flex flex-col gap-2">
				<Label>Limit per Page:</Label>
				<Select
					value={{ label: String(limit), value: String(limit) }}
					onValueChange={(option) =>
						setLimit(
							option?.value
								? parseInt(option.value)
								: DEFAULT_LIMIT
						)
					}
				>
					<SelectTrigger>
						<SelectValue
							className="native:text-lg text-sm text-foreground"
							placeholder=""
						/>
					</SelectTrigger>
					<SelectContent className="pr-4">
						{LIMIT_OPTIONS.map((option) => (
							<SelectItem
								key={option}
								label={String(option)}
								value={String(option)}
							>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</View>
			<View className="p-12" />
			<View className="flex flex-row items-center gap-4">
				<Button
					onPress={onReset}
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
