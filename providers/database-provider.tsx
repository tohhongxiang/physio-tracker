import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { deleteDatabaseAsync } from "expo-sqlite";
import { createContext, useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { toast } from "sonner-native";

import ExportDataDialog from "~/components/settings-list/data-settings/export-backup-dialog";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { DATABASE_NAME, db, expoSQLiteDb } from "~/db/initalize";
import migrations from "~/drizzle/migrations";

const DBContext = createContext({ db });

export default function DatabaseProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const { success, error } = useMigrations(db, migrations);
	useDrizzleStudio(expoSQLiteDb);

	useEffect(() => {
		if (!success) return;
	}, [success]);

	const [isResettingDb, setIsResettingDb] = useState(false);
	const handleResetDb = async () => {
		setIsResettingDb(true);
		try {
			await db.$client.closeAsync();
			await deleteDatabaseAsync(DATABASE_NAME);
			toast.success("DB reset successfully");
		} catch (error) {
			console.error(error);
		}
		setIsResettingDb(false);
	};

	if (error) {
		console.error("Migration error", error);
	}

	return (
		<DBContext.Provider value={{ db }}>
			{children}
			{error ? (
				<View className="flex h-full w-full items-center justify-center border bg-background inset-0 absolute top-0 left-0 z-10">
					<View className="flex flex-col gap-4 px-8 py-32">
						<View className="h-16" />
						<Text className="text-xl font-bold">
							Migration error:
						</Text>
						<ScrollView className="flex-1">
							<Text className="">{error?.message}</Text>
						</ScrollView>
						<Text className="italic">
							If you see this, a fatal error has occurred. Please
							reset the database.
						</Text>
						<View className="flex flex-row gap-2 justify-center items-center">
							<ExportDataDialog>
								<Button className="my-4">
									<Text>Export Data</Text>
								</Button>
							</ExportDataDialog>
							<Button
								variant="destructive"
								disabled={isResettingDb}
								className="my-4"
								onPress={handleResetDb}
							>
								<Text>
									{isResettingDb
										? "Resetting DB..."
										: "Reset DB"}
								</Text>
							</Button>
						</View>
					</View>
				</View>
			) : null}
		</DBContext.Provider>
	);
}

export function useDatabase() {
	const ctx = useContext(DBContext);
	return ctx;
}
