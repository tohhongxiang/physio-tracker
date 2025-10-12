import { Info, LoaderCircle, Trash } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

import { DeleteAllOptions } from "~/api/delete-all";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "~/components/ui/dialog";
import { Icon } from "~/components/ui/icon";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import useDeleteAll from "~/hooks/api/use-delete-all";
import useDeleteAlert from "~/hooks/use-delete-alert";

export default function DeleteAllDataDialog({
	children
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [options, setOptions] = useState<DeleteAllOptions>({
		workouts: true,
		pinned: true,
		logs: true,
		settings: false // Default: don't delete settings
	});

	function toggleCheckedState(key: keyof DeleteAllOptions) {
		return () => {
			setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
		};
	}

	function toggleAll() {
		setOptions((previousOptions) => {
			const allSelected = Object.values(previousOptions).every(Boolean);
			return {
				workouts: !allSelected,
				pinned: !allSelected,
				logs: !allSelected,
				settings: !allSelected
			};
		});
	}

	const { isLoading, deleteAll } = useDeleteAll({
		onSuccess: (deletedResult) => {
			const parts = [];
			if (deletedResult.workouts > 0)
				parts.push(`${deletedResult.workouts} workout(s)`);
			if (deletedResult.pinned > 0)
				parts.push(`${deletedResult.pinned} pinned`);
			if (deletedResult.logs > 0)
				parts.push(`${deletedResult.logs} log(s)`);
			if (deletedResult.settings > 0) parts.push("settings");

			toast(
				parts.length > 0
					? `Deleted ${parts.join(", ")}`
					: "No data deleted"
			);
			setIsOpen(false);
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	const alert = useDeleteAlert();
	const hasSelection = Object.values(options).some(Boolean);

	function handleSubmit() {
		alert({
			title: "Delete Selected Data?",
			description:
				"This action is permanent. Are you sure you want to delete the selected data?",
			actionText: "Delete selected data",
			loadingText: "Deleting",
			onConfirm: async () => {
				await new Promise<void>((res) => setTimeout(() => res(), 100));
				await deleteAll(options);
			},
			onSuccess: () => {
				setIsOpen(false);
			}
		});
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Data</DialogTitle>
					<View className="bg-destructive rounded-md p-4 flex flex-col gap-2 mt-2">
						<View className="flex flex-row gap-2 items-center">
							<Icon
								as={Info}
								className="text-destructive-foreground h-6 w-6"
							/>
							<Text className="text-destructive-foreground font-bold">
								This action is IRREVERSIBLE
							</Text>
						</View>
						<Text className="opacity-80 text-destructive-foreground">
							Selected data will be permanently deleted.
						</Text>
					</View>
				</DialogHeader>

				<View className="flex flex-col gap-3 mt-2">
					<View className="flex flex-row justify-between items-center mb-1">
						<Text className="text-sm font-medium">
							Select data to delete:
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
							id="delete-workouts"
							checked={options.workouts ?? false}
							onCheckedChange={toggleCheckedState("workouts")}
						/>
						<Label
							htmlFor="delete-workouts"
							onPress={toggleCheckedState("workouts")}
						>
							Workouts
						</Label>
					</View>

					<View className="flex flex-row items-center gap-2">
						<Checkbox
							id="delete-pinned"
							checked={options.pinned ?? false}
							onCheckedChange={toggleCheckedState("pinned")}
						/>
						<Label
							htmlFor="delete-pinned"
							onPress={toggleCheckedState("pinned")}
						>
							Pinned Workouts
						</Label>
					</View>

					<View className="flex flex-row items-center gap-2">
						<Checkbox
							id="delete-logs"
							checked={options.logs ?? false}
							onCheckedChange={toggleCheckedState("logs")}
						/>
						<Label
							htmlFor="delete-logs"
							onPress={toggleCheckedState("logs")}
						>
							Workout Logs
						</Label>
					</View>

					<View className="flex flex-row items-center gap-2">
						<Checkbox
							id="delete-settings"
							checked={options.settings ?? false}
							onCheckedChange={toggleCheckedState("settings")}
						/>
						<Label
							htmlFor="delete-settings"
							onPress={toggleCheckedState("settings")}
						>
							Workout Settings
						</Label>
					</View>
				</View>
				<DialogFooter className="flex flex-row justify-end">
					<DialogClose asChild>
						<Button variant="outline" className="flex-1">
							<Text>Cancel</Text>
						</Button>
					</DialogClose>
					<Button
						variant="destructive"
						className="flex-1 flex flex-row gap-2 justify-center items-center"
						onPress={handleSubmit}
						disabled={isLoading || !hasSelection}
					>
						{isLoading ? (
							<>
								<View className="animate-spin">
									<Icon
										as={LoaderCircle}
										className="text-primary-foreground"
										size={16}
									/>
								</View>
								<Text>Loading</Text>
							</>
						) : (
							<>
								<Icon
									as={Trash}
									className="text-primary-foreground"
									size={16}
								/>
								<Text>Delete</Text>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
