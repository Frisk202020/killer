import { Faction, Race } from "@/db/data";

export function buildGetBody(factions?: Faction[], names?: string[]) {
    const query = [];
    if (factions !== undefined && factions.length > 0) query.push(`factions=${factions.join()}`);
    if (names !== undefined && names.length > 0) query.push(`names=${names.join()}`);

    return query.join("&");
}

export interface PutBody {
    name: string,
    faction: Faction,
    race: Race
}

export interface PostBody {
    name: string,
    data: {
        gold?: number,
        self_score?: number,
        faction_score?: number,
        faction?: Faction,
        alive?: boolean,
        race?: Race
    }
}