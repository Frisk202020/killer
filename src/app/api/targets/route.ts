import { NextResponse } from "next/server";
import { BuildError, PlayerNotFound } from "../api-error";
import { faction_targets, players } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Faction } from "@/db/data";
import { db } from "@/db";
import { GetSchema, Schema } from "./model";
import { AuthenticatedJsonRoute, GetRoute } from "../route";

export const GET = GetRoute(GetSchema, false, async (body) => NextResponse.json({ 
    targets: await db.select().from(faction_targets).where(and(eq(faction_targets.faction, body.faction)))
}));  

export const PUT = AuthenticatedJsonRoute(Schema, true, async (body) => {
    const target = (await db.select().from(players).where(eq(players.name, body.target)))[0];
    if (!target) return PlayerNotFound;

    const is_target = (await db.select().from(faction_targets).where(and(
        eq(faction_targets.target, target.id),
        eq(faction_targets.faction, body.faction as Faction),
    ))).length > 0;

    if (is_target) return BuildError(409, "Is already the target of this faction");
    await db.insert(faction_targets).values({faction: body.faction, target: target.id});

    return NextResponse.json({});
});  

export const DELETE = AuthenticatedJsonRoute(Schema, true, async (body) => {
    const target = (await db.select().from(players).where(eq(players.name, body.target)))[0];
    if (!target) return PlayerNotFound;

    await db.delete(faction_targets).where(and(
        eq(faction_targets.faction, body.faction),
        eq(faction_targets.target, target.id),
    ));

    return NextResponse.json({});
});  