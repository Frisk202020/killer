import { db } from "@/db";
import { BuildError, PlayerNotFound, PlayerUnauthorized } from "../api-error";
import { PostSchema } from "./model";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { AuthenticatedJsonRoute } from "../route";
import { assertAuthorized } from "../authenticate";

export const POST = AuthenticatedJsonRoute(PostSchema, false, async (body, user) => {
    const promises = [
        db.select().from(players).where(eq(players.name, body.winner)),
        db.select().from(players).where(eq(players.name, body.looser))
    ];

    const [winner, looser] = (await Promise.all(promises)).map((x) => x[0]);
    if (!winner || !looser) return PlayerNotFound;
    if (!assertAuthorized(user, winner.id, looser.id)) return PlayerUnauthorized;
    if (winner.arena_tokens === 0 || looser.arena_tokens === 0) return BuildError(409, "One or both players are out of tokens");
    
    await db.update(players)
        .set({arena_tokens: winner.arena_tokens - 1, arena_victories: winner.arena_victories + 1})
        .where(eq(players.id, winner.id));

    await db.update(players)
        .set({arena_tokens: looser.arena_tokens - 1})
        .where(eq(players.id, looser.id));

    return NextResponse.json({});
});