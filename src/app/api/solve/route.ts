import { db } from "@/db";
import { AuthenticatedJsonRoute } from "../route";
import { PostOutput, PostSchema } from "./model";
import { enigmas, faction_vault, players, solved_enigmas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BuildError } from "../api-error";
import { CURRENT_DAY, EnigmaReward } from "@/db/data";
import { NextResponse } from "next/server";

export const POST = AuthenticatedJsonRoute(PostSchema, false, async (body, user) => {
    if (body.day > CURRENT_DAY) return BuildError(403);

    if (user.player_id === null) {
        if (!user.admin) return BuildError(401);
    } else {
        const player = (await db.select({faction: players.faction}).from(players).where(eq(players.id, user.player_id)))[0];
        if (player.faction !== body.faction) return BuildError(401);
    }

    const enigma = (await db.select().from(enigmas).where(eq(enigmas.id, body.day)))[0];
    if (enigma === undefined) return BuildError(404);
    if (enigma.solution.toLowerCase() !== body.solution.toLowerCase()) return BuildError(406);

    const res = await db.insert(solved_enigmas).values({ enigma: body.day, faction: body.faction }).onConflictDoNothing();
    if (res.changes === 0) return BuildError(409);

    const rank = (await db.select().from(solved_enigmas).where(eq(solved_enigmas.enigma, body.day))).length;
    const amount = EnigmaReward(rank);

    const vault = (await db.select().from(faction_vault).where(eq(faction_vault.faction, body.faction)))[0];
    const reward = { gold: amount * enigma.gold_reward, score: amount * enigma.score_reward };

    if (vault === undefined) await db.insert(faction_vault).values({faction: body.faction, gold: reward.gold, score: reward.score });
    else await db.update(faction_vault).set({gold: vault.gold + reward.gold, score: vault.score + reward.score}).where(eq(faction_vault.id, vault.id));
    
    const out: PostOutput = { rank };
    return NextResponse.json(out);
})