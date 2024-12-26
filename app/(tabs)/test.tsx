import { Keyboard, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";

const SELECT_OPTIONS = [
	{ label: "Name", value: "name" },
	{ label: "Date created", value: "dateCreated" }
];

export default function TestPage() {
	const bottomSheetRef = useRef<BottomSheet>(null);

	const [selectedValue, setSelectedValue] = useState<
		(typeof SELECT_OPTIONS)[number] | undefined
	>(SELECT_OPTIONS[0]);
	const [search, setSearch] = useState("");

	function handleResetFilters() {
		setSelectedValue(SELECT_OPTIONS[0]);
		setSearch("");
	}

	function handleConfirmFilters() {
		Keyboard.dismiss();
		bottomSheetRef.current?.close();
	}

	return (
		<View className="flex-1 p-8">
			<Button onPress={() => bottomSheetRef.current?.expand()}>
				<Text>Open Bottom Sheet</Text>
			</Button>
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
					<View className="flex flex-col gap-2">
						<Label>Filter by Name:</Label>
						<Input
							placeholder="Search..."
							value={search}
							onChangeText={setSearch}
						/>
					</View>
					<View className="flex flex-col gap-2">
						<Label>Sort By:</Label>
						<Select
							value={selectedValue}
							onValueChange={setSelectedValue}
						>
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
						<Button
							onPress={handleConfirmFilters}
							className="flex-grow"
						>
							<Text>Apply Filters</Text>
						</Button>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</View>
	);
}
