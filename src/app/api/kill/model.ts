import { Faction } from "@/db/data";

export interface PostBody {
    query_faction: Faction,
    killed: string,
    killer: string
}