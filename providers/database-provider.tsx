import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { deleteDatabaseAsync } from "expo-sqlite";
import { createContext, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

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
		await deleteDatabaseAsync(DATABASE_NAME);
		toast.success("DB reset successfully");
		setIsResettingDb(false);
	};

	if (error) {
		console.error("Migration error", error);
		return (
			<View className="flex h-full w-full items-center justify-center border bg-white">
				<View className="flex flex-col gap-4 px-8 py-32">
					<Text className="text-xl font-bold text-black">
						Migration error:
					</Text>
					<Text className="text-black">{error?.message}</Text>
					<Text className="italic text-black">
						If you see this, a fatal error has occurred. Please
						reset the database.
					</Text>
					<Button
						variant="destructive"
						disabled={isResettingDb}
						className="my-4"
					>
						<Text onPress={handleResetDb}>
							{isResettingDb ? "Resetting DB..." : "Reset DB"}
						</Text>
					</Button>
				</View>
			</View>
		);
	}

	return <DBContext.Provider value={{ db }}>{children}</DBContext.Provider>;
}

export function useDatabase() {
	const ctx = useContext(DBContext);
	return ctx;
}
