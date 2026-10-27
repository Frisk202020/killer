import bcrypt from "bcryptjs";

const HOST = "http://localhost:3000"
export const route_from_host = (route: string) => HOST + "/" + route;

interface RaceDescription {
    name: string,
    base_gear: Gear[]
}

interface Gear {
    type: GearTypes,
    range: GearRanges
}

type GearRanges = 2 | 3 | 4 | 5 | 6;
type GearTypes = "Melee" | "Ranged" | "Shield";

const RACES = [
    { name: "Assassin", base_gear: [{type: "Melee", range: 5}] },
    { name: "Guerrier", base_gear: [{type: "Melee", range: 4}] },
    { name: "Bombardier", base_gear: [{type: "Ranged", range: 6}, {type: "Shield", range: 4}]}
] as const satisfies readonly RaceDescription[];

export const FACTIONS = ["Aazimaar", "Sapiens", "Tiefflins"] as const;
export type Faction = typeof FACTIONS[number];

export type Race = (typeof RACES)[number]["name"];
export const race_names = RACES.map((x) => x.name) as [Race, ...Race[]];

export const BASE_TARGETS_COUNT = 2;
export const KILL_REWARD = 50;
export const ARENA_TOKENS = 5;

export const DAYS_LOWER_BOUND = 1;
export const DAYS_HIGHER_BOUND = 7;

export const hash = async (pwd: string) => await bcrypt.hash(pwd, 10);