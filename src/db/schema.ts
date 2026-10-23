import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ARENA_TOKENS, FACTIONS, race_names } from "./data";

export const invitations = sqliteTable("invitations", {
    id: integer().primaryKey().references(() => accounts.id),
    token: text().notNull(),
    expires: integer({mode: "timestamp"}).notNull()
});

export const accounts = sqliteTable("accounts", {
    id: integer().primaryKey({autoIncrement: true}),
    name: text().notNull().unique(),
    discord_id: text().notNull().unique(),
    pwd: text(),
    player_id: integer().references(() => players.id).unique(),
    admin: integer({mode: "boolean"}).default(false)
});

export const sessions = sqliteTable("sessions", {
    id: integer().primaryKey({autoIncrement: true}),
    account: integer().references(() => accounts.id),
    token: text().notNull().unique(),
    expires: integer({mode: "timestamp"}).notNull()
})

export const players = sqliteTable("players", {
    id: integer().primaryKey({autoIncrement: true}),
    name: text().notNull().unique(),
    gold: integer().notNull().default(0),
    self_score: integer().notNull().default(0),
    faction_score: integer().notNull().default(0),
    faction: text({enum: FACTIONS}).notNull(),
    alive: integer({mode: "boolean"}).notNull().default(true),
    race: text({enum: race_names}).notNull(),
    target_weight: integer().notNull().default(50),
    arena_tokens: integer().notNull().default(ARENA_TOKENS),
    arena_victories: integer().notNull().default(0)
});

export const faction_targets = sqliteTable("faction_targets", {
    id: integer().primaryKey({autoIncrement: true}),
    target: integer().notNull().references(() => players.id),
    faction: text({enum: FACTIONS}).notNull(),
});

export const external_faction_score = sqliteTable("external_faction_score", {
    id: integer().primaryKey({autoIncrement: true}),
    faction: text({enum: FACTIONS}).notNull(),
    score: integer().notNull().default(0)
});

export const enigmas = sqliteTable("enigmas", {
    id: integer().primaryKey(),
    content: text()
});