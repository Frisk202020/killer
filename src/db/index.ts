import { drizzle } from "drizzle-orm/better-sqlite3";

export const db_file = "local.db";
export const db = drizzle(db_file);