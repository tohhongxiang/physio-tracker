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
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import useRestoreBackup from "~/hooks/api/use-restore-backup";
import { File } from "~/lib/icons/File";
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
	const [parsedData, setParsedData] = useState<ExportData | null>(null);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	async function pickFile() {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: "application/json",
				copyToCacheDirectory: true
			});

			setErrorMessages([]);
			setParsedData(null);

			if (result.canceled) {
				setSelectedFile(null);
				return;
			}

			const file = result.assets[0];
			if (!file) return;

			const jsonString = await FileSystem.readAsStringAsync(file.uri);
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

			setParsedData(data as ExportData);
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
		if (!parsedData) {
			setErrorMessages(["No file selected"]);
			return;
		}

		// Pass data to your DB import function
		restoreBackup(parsedData);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Restore Backup</DialogTitle>
					<View className="bg-destructive rounded-md p-4 flex flex-col gap-2 mt-2">
						<View className="flex flex-row gap-2 items-center">
							<Info className="text-destructive-foreground" />
							<Text className="text-destructive-foreground font-bold">
								Warning: This will overwrite all existing data
							</Text>
						</View>
						<Text className="opacity-80 text-destructive-foreground">
							Your current workouts, logs, and pinned workouts
							will be permanently deleted.
						</Text>
					</View>
				</DialogHeader>
				<View className="flex flex-col gap-4 my-4">
					<Button
						variant="outline"
						className="flex flex-row gap-2 items-center justify-center"
						onPress={pickFile}
					>
						<File className="text-foreground" size={16} />
						<Text>
							{selectedFile ? "Change File" : "Choose File"}
						</Text>
					</Button>
					{selectedFile && (
						<Text className="text-xs text-muted-foreground mb-2">
							Selected file: {selectedFile.name}
						</Text>
					)}
					{parsedData && (
						<View>
							<Text>
								Backup date:{" "}
								{new Date(
									parsedData.timestamp
								).toLocaleDateString("default", {
									day: "2-digit",
									month: "short",
									year: "numeric"
								})}
								,{" "}
								{new Intl.DateTimeFormat("en-US", {
									timeStyle: "short"
								}).format(new Date(parsedData.timestamp))}
							</Text>
							<Text>{`Contents: ${parsedData.data.workouts.length} workout(s), ${parsedData.data.pinned.length} pinned, ${parsedData.data.logs.length} log(s)`}</Text>
						</View>
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
						disabled={!parsedData || isLoading}
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
								<Text>Restore Backup</Text>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
