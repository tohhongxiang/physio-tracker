import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
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
import { Text } from "~/components/ui/text";
import useRestoreBackup from "~/hooks/api/use-restore-backup";
import { Info } from "~/lib/icons/Info";
import { LoaderCircle } from "~/lib/icons/LoaderCircle";
import { Upload } from "~/lib/icons/Upload";
import { ExportData } from "~/types";

import validateBackupData from "./utils/validate-backup-data";

export default function ImportDataDialog({
	children
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedFile, setSelectedFile] =
		useState<DocumentPicker.DocumentPickerAsset | null>(null);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	async function pickFile() {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: "application/json",
				copyToCacheDirectory: true
			});

			if (result.canceled) {
				setSelectedFile(null);
				setErrorMessages([]);
				return;
			}

			const file = result.assets[0];
			if (!file) return;

			setSelectedFile(file);
			setErrorMessages([]);
		} catch (err) {
			console.error(err);
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error";
			setErrorMessages([`Failed to pick a file: ${errorMessage}`]);
		}
	}

	const {
		isLoading,
		restoreBackup,
		error: restoreBackupError
	} = useRestoreBackup({
		onSuccess: (data) => {
			toast.success(
				`Restored ${data.workouts.length} workout(s), ${data.pinned.length} pinned workout(s) and ${data.logs.length} workout logs`
			);
			setIsOpen(false);
		},
		onError: (error) => {
			console.error(error);
			setErrorMessages([`Failed to import data: ${error.message}`]);
		}
	});
	async function handleSubmit() {
		setErrorMessages([]);

		if (!selectedFile) {
			setErrorMessages(["No file selected"]);
			return;
		}

		const jsonString = await FileSystem.readAsStringAsync(selectedFile.uri);
		let data: unknown;
		try {
			data = JSON.parse(jsonString);
		} catch {
			setErrorMessages(["Invalid JSON file"]);
			return;
		}

		const errorMessages = validateBackupData(data);
		if (errorMessages.length > 0) {
			setErrorMessages(errorMessages);
			return;
		}

		// Pass data to your DB import function
		restoreBackup(data as ExportData);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import Data</DialogTitle>
					<DialogDescription>
						Select a JSON backup file to import into your database.
					</DialogDescription>
					<View className="bg-destructive rounded-md p-2 flex flex-row gap-2 items-center mt-4">
						<Info className="text-destructive-foreground" />
						<Text className="text-destructive-foreground">
							Warning: This will delete all your data
						</Text>
					</View>
				</DialogHeader>
				<View className="flex flex-col gap-4 my-4">
					<Button variant="outline" onPress={pickFile}>
						<Text>
							{selectedFile ? "Change File" : "Choose File"}
						</Text>
					</Button>
					{selectedFile && (
						<Text className="text-xs text-muted-foreground mb-2">
							Selected file: {selectedFile.name}
						</Text>
					)}
					{restoreBackupError && (
						<View>
							<Text className="text-destructive font-medium">
								Backup error:
							</Text>
							<Text className="text-destructive">
								{restoreBackupError.message}
							</Text>
						</View>
					)}
					{errorMessages.length > 0 && (
						<View className="flex flex-col gap-2 max-h-32 w-full max-w-full">
							<Text className="text-destructive font-medium">
								Import Errors ({errorMessages.length}):
							</Text>
							<ScrollView>
								<View onStartShouldSetResponder={() => true}>
									{errorMessages.map(
										(errorMessage, index) => (
											<Text
												className="text-destructive text-xs"
												key={index}
											>
												{`${index + 1}. ${errorMessage}`}
											</Text>
										)
									)}
								</View>
							</ScrollView>
						</View>
					)}
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
						disabled={!selectedFile || isLoading}
					>
						{isLoading ? (
							<>
								<View className="animate-spin">
									<LoaderCircle
										className="text-primary-foreground"
										size={16}
									/>
								</View>
								<Text>Loading</Text>
							</>
						) : (
							<>
								<Upload
									className="text-primary-foreground"
									size={16}
								/>
								<Text>Import</Text>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
