import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { ARENA_TOKENS, FACTIONS, race_names } from "./data";

export const invitations = sqliteTable("invitations", {
    id: integer().primaryKey().references(() => accounts.id, { onDelete: "cascade" }),
    token: text().notNull(),
    expires: integer({mode: "timestamp"}).notNull()
});

export const accounts = sqliteTable("accounts", {
    id: integer().primaryKey({autoIncrement: true}),
    name: text().notNull().unique(),
    discord_id: text().notNull().unique(),
    pwd: text(),
    player_id: integer().references(() => players.id, { onDelete: "cascade" }).unique(),
    admin: integer({mode: "boolean"}).default(false)
});

export const sessions = sqliteTable("sessions", {
    id: integer().primaryKey({autoIncrement: true}),
    account: integer().references(() => accounts.id, { onDelete: "cascade" }),
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
    target: integer().notNull().references(() => players.id, { onDelete: "cascade" }),
    faction: text({enum: FACTIONS}).notNull(),
});

export const faction_vault = sqliteTable("faction_vault", {
    id: integer().primaryKey({autoIncrement: true}),
    faction: text({enum: FACTIONS}).notNull().unique(),
    score: integer().notNull().default(0),
    gold: integer().notNull().default(0)
});

export const enigmas = sqliteTable("enigmas", {
    id: integer().primaryKey(),
    content: text().notNull(),
    solution: text().notNull(),
    gold_reward: integer().default(0).notNull(),
    score_reward: integer().default(0).notNull()
});

export const solved_enigmas = sqliteTable("solved_enigmas", {
    id: integer().primaryKey({autoIncrement: true}),
    enigma: integer().notNull().references(() => enigmas.id, { onDelete: "cascade" }),
    faction: text({enum: FACTIONS}).notNull()
}, (t) => [
    unique().on(t.enigma, t.faction)
]);