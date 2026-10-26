import { db } from "@/db";
import { BuildError, PlayerUnauthorized } from "../api-error";
import { PostSchema } from "./model";
import { faction_targets, players } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { new_target } from "@/db/targets";
import { NextResponse } from "next/server";
import { KILL_REWARD } from "@/db/data";
import { AuthenticatedJsonRoute } from "../route";
import { assertAuthorized } from "../authenticate";

export const POST = AuthenticatedJsonRoute(PostSchema, true, async (body, user) => {
    const killer = (await db.select().from(players).where(eq(players.name, body.killer)))[0];
    if (!killer) return BuildError(404, "Killer not found");
    if (!killer.alive) return BuildError(409, "Player is dead");

    const killed = (await db.select().from(players).where(eq(players.name, body.killed)))[0];
    if (!killed) return BuildError(404, "Killed not found");
    if (!killed.alive) return BuildError(409, "Killed is dead");

    if (!assertAuthorized(user, killer.id, killed.id)) return PlayerUnauthorized;

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
}); 