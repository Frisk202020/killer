import { db } from "@/db";
import { BuildError, PlayerUnauthorized } from "../api-error";
import { PostSchema } from "./model";
import { accounts, faction_targets, players } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { new_target } from "@/db/targets";
import { NextResponse } from "next/server";
import { KILL_REWARD } from "@/db/data";
import { AuthenticatedJsonRoute } from "../route";
import { assertAuthorized } from "../authenticate";
import Bot from "@/app/discord";

export const POST = AuthenticatedJsonRoute(PostSchema, false, async (body, user) => {
    const [killerP, killedP] = ([
        body.killer,
        body.killed
    ] as const).map(async (x) => (await db.select({
        player: {
            id: players.id,
            name: players.name,
            alive: players.alive,
            faction: players.faction,
            self_score: players.self_score
        }, account: {
            discord: accounts.discord_id
        }
    }).from(players).where(eq(players.name, x)).innerJoin(accounts, eq(accounts.player_id, players.id)))[0])

    const [killer, killed] = [await killerP, await killedP];
    if (killer === undefined) return BuildError(404, "Killer not found");
    if (killed === undefined) return BuildError(404, "Killed not found");
    if (!assertAuthorized(user, killer.player.id, killed.player.id)) return PlayerUnauthorized;

    const target = (await db.select().from(faction_targets).where(and(
        eq(faction_targets.faction, body.query_faction), 
        eq(faction_targets.target, killed.player.id)
    )))[0];
    if (!target) return BuildError(400, `${killed.player.name} is not a target of this faction`);

    await db.delete(faction_targets).where(and(
        eq(faction_targets.faction, killer.player.faction),
        eq(faction_targets.target, target.target)
    ));

    Bot.Send(`${Bot.PingUser(killer.account.discord)} a assassiné ${Bot.PingUser(killed.account.discord)} !`, "debug", body.proof);

    killer.player.self_score += KILL_REWARD;
    await db.update(players).set(killer.player).where(eq(players.id, killer.player.id));

    killed.player.alive = false;
    await db.update(players).set(killed.player).where(eq(players.id, killed.player.id));

    await new_target(body.query_faction);
    return NextResponse.json({});
}, true); 