import { db } from "@/db";
import { ARENA_TOKENS } from "@/db/data";
import { players } from "@/db/schema";
import { NextResponse } from "next/server";
import { authenticate } from "../authenticate";
import { BuildError } from "../api-error";

export async function POST() {
    const user = await authenticate();
    if (user === null || !user.admin) return BuildError(401);

    await db.update(players).set({arena_tokens: ARENA_TOKENS, alive: true});
    return NextResponse.json({});
}