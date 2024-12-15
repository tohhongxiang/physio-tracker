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
		return (
			<View>
				<Text>Migration error: {error.message}</Text>
			</View>
		);
	}

	return <DBContext.Provider value={{ db }}>{children}</DBContext.Provider>;
}

export function useDatabase() {
	const ctx = useContext(DBContext);
	return ctx;
}
