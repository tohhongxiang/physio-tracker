import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Download } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

import { LoadingSpinner } from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "~/components/ui/dialog";
import { Icon } from "~/components/ui/icon";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import useGetExportData from "~/hooks/api/use-get-export-data";

export default function ExportDataDialog({
	children
}: {
	children: React.ReactNode;
}) {
	const [options, setOptions] = useState({
		workouts: true, // always included
		pinned: true,
		logs: true,
		settings: true
	});

	function toggleCheckedState(key: keyof typeof options) {
		return () => {
			setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
		};
	}

	function toggleAll() {
		setOptions((previousOptions) => {
			const allSelected = Object.values(previousOptions).every(Boolean);
			return {
				workouts: true, // always stay included
				pinned: !allSelected,
				logs: !allSelected,
				settings: !allSelected
			};
		});
	}

	const { isRefetching: isExporting, refetch: getExportData } =
		useGetExportData(options);
	const [isOpen, setIsOpen] = useState(false);

	async function handleSubmit() {
		const { data, error } = await getExportData();

		if (error) {
			toast.error(error.message);
			return;
		}

		await promptUserToSaveAsFile(data);
		setIsOpen(false);
	}

	async function promptUserToSaveAsFile(data: unknown) {
		const filename = `physio-tracker-backup-${new Date()
			.toISOString()
			.replace(/[:.]/g, "-")}.json`; // safer filename
		const json = JSON.stringify(data, null, 2);
		const fileURI = FileSystem.cacheDirectory + filename;

		try {
			await FileSystem.writeAsStringAsync(fileURI, json, {
				encoding: FileSystem.EncodingType.UTF8
			});

			if (await Sharing.isAvailableAsync()) {
				await Sharing.shareAsync(fileURI);
			} else {
				toast.error("Sharing not available on this device");
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			toast.error(`Failed to create backup: ${errorMessage}`);
		} finally {
			try {
				await FileSystem.deleteAsync(fileURI, { idempotent: true });
			} catch (cleanupErr) {
				console.warn("Failed to delete temp file:", cleanupErr);
			}
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Export Backup</DialogTitle>
					<DialogDescription>
						Select which information to export. A JSON backup file
						will be created, and you can choose where to save or
						share it.
					</DialogDescription>
				</DialogHeader>

				<View className="flex flex-col gap-3">
					<View className="flex flex-row justify-between items-center mb-1">
						<Text className="text-sm font-medium">
							Select data types to export:
						</Text>
						<Button variant="ghost" size="sm" onPress={toggleAll}>
							<Text>
								{Object.values(options).every(Boolean)
									? "Deselect All"
									: "Select All"}
							</Text>
						</Button>
					</View>

					<View className="flex flex-row items-center gap-2">
						<Checkbox
							id="workouts"
							checked={options.workouts}
							onCheckedChange={() => {}}
							disabled
						/>
						<Label htmlFor="workouts" disabled>
							Your Workouts (always included)
						</Label>
					</View>

					<View className="flex flex-row items-center gap-2">
						<Checkbox
							id="pinned"
							checked={options.pinned}
							onCheckedChange={toggleCheckedState("pinned")}
						/>
						<Label
							htmlFor="pinned"
							onPress={toggleCheckedState("pinned")}
						>
							Pinned Workouts
						</Label>
					</View>

					<View className="flex flex-row items-center gap-2">
						<Checkbox
							id="logs"
							checked={options.logs}
							onCheckedChange={toggleCheckedState("logs")}
						/>
						<Label
							htmlFor="logs"
							onPress={toggleCheckedState("logs")}
						>
							Workout Logs
						</Label>
					</View>

					<View className="flex flex-row items-center gap-2">
						<Checkbox
							id="settings"
							checked={options.settings}
							onCheckedChange={toggleCheckedState("settings")}
						/>
						<Label
							htmlFor="settings"
							onPress={toggleCheckedState("settings")}
						>
							Workout Settings
						</Label>
					</View>
				</View>

				<DialogFooter className="flex flex-row justify-end gap-2">
					<DialogClose asChild>
						<Button variant="outline">
							<Text>Cancel</Text>
						</Button>
					</DialogClose>
					<Button
						className="flex flex-row gap-2 justify-center items-center"
						onPress={handleSubmit}
						disabled={isExporting}
					>
						{isExporting ? (
							<>
								<LoadingSpinner
									iconClassName="text-primary-foreground"
									size={16}
								/>
								<Text>Loading</Text>
							</>
						) : (
							<>
								<Icon
									as={Download}
									className="text-primary-foreground"
									size={16}
								/>
								<Text>Export</Text>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
