import { db } from "@/db";
import { ARENA_TOKENS } from "@/db/data";
import { players } from "@/db/schema";
import { NextResponse } from "next/server";

/**
 * Admin
 */
export async function POST(request: Request) {
    db.update(players).set({arena_tokens: ARENA_TOKENS, alive: true});
    return NextResponse.json({});
}