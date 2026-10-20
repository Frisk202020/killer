import { Faction } from "@/db/data";

export function buildGetBody(faction: Faction) {
    return `faction=${faction}`;
}

export interface PutBody {
    faction: Faction,
    target: string
}

export interface DeleteBody {
    faction: Faction,
    target: string
}