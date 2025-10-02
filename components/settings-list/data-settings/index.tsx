import { Database, Download, Trash, Upload } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "~/components/ui/card";
import { Icon } from "~/components/ui/icon";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";

import DeleteAllDataDialog from "./delete-all-data-dialog";
import ExportBackupDialog from "./export-backup-dialog";
import ImportBackupDialog from "./import-backup-dialog";

export default function Data() {
	return (
		<Card className="bg-background">
			<CardHeader>
				<View className="flex flex-row gap-2 items-center mb-1">
					<Icon
						as={Database}
						className="text-card-foreground h-6 w-6"
					/>
					<CardTitle className="flex flex-row gap-4">
						Data and Privacy
					</CardTitle>
				</View>
				<CardDescription>
					Manage your data and privacy settings
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 w-full">
				<View className="flex flex-row gap-4 w-full justify-center items-center">
					<View className="flex-1">
						<ExportBackupDialog>
							<Button
								variant="secondary"
								className="flex flex-row gap-2 justify-center items-center"
							>
								<Icon
									as={Download}
									size={16}
									className="text-secondary-foreground"
								/>
								<Text>Export Backup</Text>
							</Button>
						</ExportBackupDialog>
					</View>
					<View className="flex-1">
						<ImportBackupDialog>
							<Button
								variant="secondary"
								className="flex flex-row gap-2 justify-center items-center"
							>
								<Icon
									as={Upload}
									size={16}
									className="text-secondary-foreground"
								/>
								<Text>Restore Backup</Text>
							</Button>
						</ImportBackupDialog>
					</View>
				</View>
				<Separator />
				<View>
					<DeleteAllDataDialog>
						<Button
							variant="destructive"
							className="flex flex-row gap-2 justify-center items-center"
						>
							<Icon
								as={Trash}
								className="text-destructive-foreground"
								size={16}
							/>
							<Text>Clear All Data</Text>
						</Button>
					</DeleteAllDataDialog>
				</View>
			</CardContent>
		</Card>
	);
}
