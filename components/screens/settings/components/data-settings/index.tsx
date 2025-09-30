import { View } from "react-native";

import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { Database } from "~/lib/icons/Database";
import { Download } from "~/lib/icons/Download";
import { Trash } from "~/lib/icons/Trash";
import { Upload } from "~/lib/icons/Upload";

import ExportDataDialog from "./export-data-dialog";
import ImportDataDialog from "./import-data-dialog";

export default function Data() {
	return (
		<Card className="bg-background">
			<CardHeader>
				<View className="flex flex-row gap-2 items-center mb-1">
					<Database className="text-card-foreground" />
					<CardTitle className="flex flex-row gap-4">
						Data and Privacy
					</CardTitle>
				</View>
				<CardDescription>
					Manage your data and privacy settings
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 w-full">
				<View className="flex flex-row gap-4 w-full justify-center items-center border">
					<View className="flex-1">
						<ExportDataDialog>
							<Button
								variant="secondary"
								className="flex flex-row gap-2 justify-center items-center"
							>
								<Download
									size={16}
									className="text-secondary-foreground"
								/>
								<Text>Export Backup</Text>
							</Button>
						</ExportDataDialog>
					</View>
					<View className="flex-1">
						<ImportDataDialog>
							<Button
								variant="secondary"
								className="flex flex-row gap-2 justify-center items-center"
							>
								<Upload
									size={16}
									className="text-secondary-foreground"
								/>
								<Text>Restore Backup</Text>
							</Button>
						</ImportDataDialog>
					</View>
				</View>
				<Separator />
				<View>
					<Button
						variant="destructive"
						className="flex flex-row gap-2 justify-center items-center"
					>
						<Trash
							className="text-destructive-foreground"
							size={16}
						/>
						<Text>Clear All Data</Text>
					</Button>
				</View>
			</CardContent>
		</Card>
	);
}
