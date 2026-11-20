import bcrypt from "bcryptjs";
import z from "zod";

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

export function prefers_dark() {
    const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    return darkMode.matches;
}

interface RootProperties {
    "background-primary": string,
    "background-secondary": string,
    "background-objects": string,
    color: string
}

export const default_colors: RootProperties = {
    "background-primary": "#ffffff",
    "background-secondary": "#b1b1b1",
    "background-objects": "#787676",
    color: "#171717"
}

export function faction_colors(faction: Faction, dark: boolean): RootProperties {
    switch(faction) {
        case "Sapiens":
            return dark ? {
                "background-primary": "#054602",
                "background-secondary": "#011402",
                "background-objects": "#265d26",
                color: "#96f59c"
            } : {
                "background-primary": "#82f07c",
                "background-secondary": "#bcffbf",
                "background-objects": "#81c649",
                color: "#1e5b22"
            };

        case "Aazimaar":
            return dark ? {
                "background-primary": "#030838",
                "background-secondary": "#080480",
                "background-objects": "#6439fe",
                color: "#71d7e7"
            } : {
                "background-primary": "#3cf7f7",
                "background-secondary": "#96ffff",
                "background-objects": "#85fffb",
                color: "#01045a"
            };

        case "Tiefflins":
            return dark ? {
                "background-primary": "#570b03",
                "background-secondary": "#2b0100",
                "background-objects": "#822121",
                color: "#f0857f"
            } : {
                "background-primary": "#de210c",
                "background-secondary": "#ed9229",
                "background-objects": "#ebb25d",
                color: "#501104"
            };
    }
}

export type Race = (typeof RACES)[number]["name"];
export const race_names = RACES.map((x) => x.name) as [Race, ...Race[]];

export const BASE_TARGETS_COUNT = 2;
export const KILL_REWARD = 50;
export const ARENA_TOKENS = 5;

const DAYS_LOWER_BOUND = 1;
const DAYS_HIGHER_BOUND = 7;

export const Day = z.number().min(DAYS_LOWER_BOUND).max(DAYS_HIGHER_BOUND);
export function EnigmaReward(rank: number) {
    switch(rank) {
        case 1: return 1;
        case 2: return .7;
        case 3: return .5;
        default: return 0;
    }
}

export const CURRENT_DAY = 1;

export const hash = async (pwd: string) => await bcrypt.hash(pwd, 10);