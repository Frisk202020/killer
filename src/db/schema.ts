import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

interface RaceDescription {
    name: string,
    base_gear: Gear[]
}

interface Gear {
    type: GearTypes,
    range: GearRanges
}

const FACTIONS = ["Aazimaar", "Sapiens", "Tiefflins"] as const;
type GearRanges = 2 | 3 | 4 | 5 | 6;
type GearTypes = "Melee" | "Ranged" | "Shield";

const RACES = [
    { name: "Assassin", base_gear: [{type: "Melee", range: 5}] },
    { name: "Guerrier", base_gear: [{type: "Melee", range: 4}] },
    { name: "Bombardier", base_gear: [{type: "Ranged", range: 6}, {type: "Shield", range: 4}]}
] as const satisfies readonly RaceDescription[];

export type Faction = typeof FACTIONS[number];
export type Race = (typeof RACES)[number]["name"];

const race_names = RACES.map((x) => x.name) as [Race, ...Race[]];
export const players = sqliteTable("players", {
    id: integer().primaryKey({autoIncrement: true}),
    name: text().notNull(),
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