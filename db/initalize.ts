import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

export const DATABASE_NAME = "db.db";

export const expoSQLiteDb = SQLite.openDatabaseSync(DATABASE_NAME);
expoSQLiteDb.execAsync("PRAGMA foreign_keys = ON;"); // make sure foreign key constraints work https://www.sqlite.org/foreignkeys.html

export const db = drizzle(expoSQLiteDb, { schema });
