import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "~/drizzle/migrations";
import { createContext, useContext, useEffect } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { db, expoSQLiteDb } from "~/db/initalize";

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

	if (error) {
		console.error("Migration error", error);
		return (
			<View className="flex h-full w-full items-center justify-center border bg-white">
				<View className="px-8 py-32">
					<Text className="text-xl font-bold text-black">
						Migration error:
					</Text>
					<Text className="text-black">{error.message}</Text>
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
