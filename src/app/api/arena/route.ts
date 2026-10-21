import { db } from "@/db";
import { BuildError, GetError } from "../util";
import { PostBody } from "./model";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Everyone
 */
export async function POST(request: Request) {
    try {
        const body: PostBody = await request.json();
        if (!body.winner || !body.looser) return BuildError(400, "Missing arguments");

        const promises = [
            db.select().from(players).where(eq(players.name, body.winner)),
            db.select().from(players).where(eq(players.name, body.looser))
        ];

        const [winner, looser] = (await Promise.all(promises)).map((x) => x[0]);
        if (!winner || !looser) return BuildError(400, "Player not found");
        if (winner.arena_tokens === 0 || looser.arena_tokens === 0) return BuildError(401, "One or both players are out of tokens");
     
        await db.update(players)
            .set({arena_tokens: winner.arena_tokens - 1, arena_victories: winner.arena_victories + 1})
            .where(eq(players.id, winner.id));

        await db.update(players)
            .set({arena_tokens: looser.arena_tokens - 1})
            .where(eq(players.id, looser.id));

        return NextResponse.json({});
    } catch(err) {
        return GetError(err);
    }
}