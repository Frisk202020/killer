import { NextResponse } from "next/server";
import { BuildError, GetError } from "../util";
import { faction_targets, players } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Faction, validateFaction } from "@/db/data";
import { db } from "@/db";
import { DeleteBody, PutBody } from "./model";

/**
 * Everyone
 */
export async function GET(request: Request): Promise<NextResponse> {
    const url = new URL(request.url);
    const faction = url.searchParams.get("faction") as (Faction | null);
    if (!validateFaction(faction)) return BuildError(400, "Missing faction");

    return NextResponse.json({ targets: await db.select().from(faction_targets).where(and(
        eq(faction_targets.faction, faction!),
    ))});
}

/**
 * Admin
 */
export async function PUT(request: Request): Promise<NextResponse> {
    try {

        const body: PutBody = await request.json();
        if (!validateFaction(body.faction)) return BuildError(400, "Invalid faction");
        if (!body.target) return BuildError(400, "Missing target name");

        const target = (await db.select().from(players).where(eq(players.name, body.target)))[0];
        if (!target) return BuildError(400, "Player not found");

        const is_target = (await db.select().from(faction_targets).where(and(
            eq(faction_targets.target, target.id),
            eq(faction_targets.faction, body.faction as Faction),
        ))).length > 0;

        if (is_target) return BuildError(409, "Is already the target of this faction");
        await db.insert(faction_targets).values({faction: body.faction, target: target.id});

        return NextResponse.json({});
    } catch(err) {
        return GetError(err);
    }
}

/**
 * Admin
 */
export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        const body: DeleteBody = await request.json();
        if (!validateFaction(body.faction)) return BuildError(400, "Invalid faction");
        if (!body.target) return BuildError(400, "Missing target name");

        const target = (await db.select().from(players).where(eq(players.name, body.target)))[0];
        if (!target) return BuildError(400, "Player not found");

        await db.delete(faction_targets).where(and(
            eq(faction_targets.faction, body.faction),
            eq(faction_targets.target, target.id),
        ));

        return NextResponse.json({});
    } catch(err) {
        return GetError(err);
    }
}