import { db } from "@/db";
import { Faction, validateFaction, validateNumber, validateRace } from "@/db/data";
import { players } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ApiError } from "../util";
import { PutBody } from "./model";

/**
 * Get player(s) data
 * 
 * Players can only access their faction
 * Admins can access everyone
 */
export async function GET(request: Request): Promise<NextResponse> {
    const filters = [];
    try {
        const url = new URL(request.url);
        const factions = url.searchParams.get("factions")?.split(",");
        const names = url.searchParams.get("names")?.split(",");

        if (factions && factions.length != 0) filters.push(inArray(players.faction, factions as Faction[]));
        if (names && names.length != 0) filters.push(inArray(players.name, names));
    } catch(err) {}
    
    return NextResponse.json(
        { data: await db.select().from(players).where(and(...filters)) }
    )
}

/**
 * Create a new player
 * 
 * Admin-only
 */
export async function PUT(request: Request): Promise<NextResponse> {
    try {
        const body: PutBody = await request.json();
        if (!validateFaction(body.faction) || !validateRace(body.race)) return NextResponse.json(
            { error: "Invalid faction or race" },
            { status: 404 }
        )

        const x = await db.insert(players).values({
            name: body.name,
            faction: body.faction,
            race: body.race
        });
        
        return NextResponse.json({
            changes: x.changes
        });
    } catch(err) {
        return ApiError(400, "Invalid JSON");
    }    
}

/**
 * Update an existing player by name by replacing the value of every specified field
 * 
 * Admin-only
 */
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = await request.json();
        if (body.name === undefined) return ApiError(400, "Name undefined");
        
        const data = (await db.select().from(players).where(eq(players.name, body.name)))[0];
        if (data === undefined) return ApiError(400, "Player not found");

        for (const field of (["gold", "self_score", "faction_score"] as const)) {
            if (validateNumber(body.data[field])) data[field] = body.data[field];
        }

        if (body.data.alive !== undefined) data.alive = body.data.alive;
        if (validateFaction(body.data.faction)) data.faction = body.data.faction;
        if (validateRace(body.data.race)) data.race = body.data.race;

        const res = await db.update(players).set(data).where(eq(players.name, body.name));
        return NextResponse.json(
            { changes: res.changes, input: body.data, data }
        );
    } catch (err) {
        return ApiError(400, "Invalid JSON");
    }
}