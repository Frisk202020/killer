import { db } from "@/db";
import { BuildError, GetError } from "../util";
import { PostBody } from "./model";
import { faction_targets, players } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { new_target } from "@/db/targets";
import { NextResponse } from "next/server";
import { KILL_REWARD } from "@/db/data";

/**
 * Everyone
 */
export async function POST(request: Request) {
    try {
        const body: PostBody = await request.json();
        if (!body.query_faction || !body.killer || !body.killed) return BuildError(400, "Missing field(s)");

        const killer = (await db.select().from(players).where(eq(players.name, body.killer)))[0];
        if (!killer) return BuildError(400, "Killer not found");
        if (!killer.alive) return BuildError(409, "Player is dead");

        const killed = (await db.select().from(players).where(eq(players.name, body.killed)))[0];
        if (!killed) return BuildError(400, "Killed not found");
        if (!killed.alive) return BuildError(400, "Killed is dead");

        const target = (await db.select().from(faction_targets).where(and(
            eq(faction_targets.faction, body.query_faction), 
            eq(faction_targets.target, killed.id)
        )))[0];
        if (!target) return BuildError(400, `${killed.name} is not a target of this faction`);

        await db.delete(faction_targets).where(and(
            eq(faction_targets.faction, killer.faction),
            eq(faction_targets.target, target.target)
        ));

        killer.self_score += KILL_REWARD;
        await db.update(players).set(killer).where(eq(players.id, killer.id));

        if (!new_target(body.query_faction)) return BuildError(500, "");
        
        return NextResponse.json({});
    } catch(err) {
        return GetError(err);
    }
}