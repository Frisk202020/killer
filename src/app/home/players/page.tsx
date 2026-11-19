import { db } from "@/db";
import { Base } from "../base";
import { players } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { Content } from "./content";

export const instant = false;

const Players = () => Base(async (player) => {
    const team = await db.select().from(players).where(eq(players.faction, player.faction)); 
    const opponents = await db.select({
        name: players.name, alive: players.alive, faction: players.faction,
        s_score: players.self_score, a_score: players.arena_victories, tokens: players.arena_tokens
    }).from(players).where(ne(players.faction, player.faction));

    return <Content player={player} team={{members: team, faction: player.faction}} opponents={opponents.map((x) => ({
        name: x.name,
        alive: x.alive,
        faction: x.faction,
        s_score: x.s_score,
        a_score: x.a_score,
        can_battle: x.tokens > 0
    }))}></Content>
}, null);
export default Players;