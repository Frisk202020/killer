import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { FACTIONS, race_names } from "./data";

export const players = sqliteTable("players", {
    id: integer().primaryKey({autoIncrement: true}),
    name: text().notNull().unique(),
    gold: integer().notNull().default(0),
    self_score: integer().notNull().default(0),
    faction_score: integer().notNull().default(0),
    faction: text({enum: FACTIONS}).notNull(),
    alive: integer({mode: "boolean"}).notNull().default(true),
    race: text({enum: race_names}).notNull()
});

export const external_faction_score = sqliteTable("external_faction_score", {
    id: integer().primaryKey({autoIncrement: true}),
    faction: text({enum: FACTIONS}).notNull(),
    score: integer().notNull().default(0)
});