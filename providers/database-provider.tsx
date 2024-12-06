import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "~/drizzle/migrations";
import { usersTable } from "~/db/schema";
import { createContext, useContext, useEffect } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);
const DBContext = createContext<{ db: typeof db }>({} as { db: typeof db });

export default function DatabaseProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const { success, error } = useMigrations(db, migrations);

	useEffect(() => {
		if (!success) return;
		(async () => {
			await db.delete(usersTable);
			await db.insert(usersTable).values([
				{
					name: "John",
					age: 30,
					email: "john@example.com"
				}
			]);
		})();
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
