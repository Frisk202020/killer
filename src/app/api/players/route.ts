import { db } from "@/db";
import { Faction, validateFaction, validateNumber, validateRace } from "@/db/data";
import { accounts, invitations, players } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { DeleteBody, PutBody } from "./model";
import { BuildError, GetError } from "../error";
import { randomBytes } from "crypto";
import { authenticate } from "../authenticate";

export async function GET(request: Request): Promise<NextResponse> {
    const user = await authenticate();
    if (user === null) return BuildError(401, "");

    const filters = [];
    const url = new URL(request.url);

    const names = url.searchParams.get("names")?.split(",");
    if (names && names.length != 0) filters.push(inArray(players.name, names));

    if (user.admin) {
        const factions = url.searchParams.get("factions")?.split(",");
        if (factions && factions.length != 0) filters.push(inArray(players.faction, factions as Faction[]));
    } else {
        if (user.player_id === null) return BuildError(401, "");

        const player = (await db.select().from(players).where(eq(players.id, user.player_id)))[0];
        if (user.player_id === null) return BuildError(401, "");

        filters.push(eq(players.faction, player.faction));
    }
    
    return NextResponse.json(
        { data: await db.select().from(players).where(and(...filters)) }
    )
}

export async function PUT(request: Request): Promise<NextResponse> {
    const user = await authenticate();
    if (user === null || !user.admin) return BuildError(401, "");

    try {
        const body: PutBody = await request.json();
        if (!validateFaction(body.faction) || !validateRace(body.race)) return NextResponse.json(
            { error: "Invalid faction or race" },
            { status: 404 }
        )

        const res = await db.insert(players).values({
            name: body.name,
            faction: body.faction,
            race: body.race
        });

        const token = randomBytes(32).toString("hex");
        const expires = new Date(Date.now());
        expires.setHours(expires.getHours() + 1);

        const account = await db.insert(accounts).values({ name: body.name, discord_id: body.discord_id, player_id: res.lastInsertRowid as number });
        await db.insert(invitations).values({ id: account.lastInsertRowid as number, token, expires });

        console.log(token);
        
        return NextResponse.json({});
    } catch(err) {
        return GetError(err);
    }    
}

export async function POST(request: Request): Promise<NextResponse> {
    const user = await authenticate();
    if (user === null || !user.admin) return BuildError(401, "");

    try {
        const body = await request.json();
        if (body.name === undefined) return BuildError(400, "Name undefined");
        
        const data = (await db.select().from(players).where(eq(players.name, body.name)))[0];
        if (data === undefined) return BuildError(400, "Player not found");

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
        return GetError(err);
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    const user = await authenticate();
    if (user === null || !user.admin) return BuildError(401, "");

    try {
        const body: DeleteBody = await request.json();
        if (body.name == "") return BuildError(400, "Name not provided");
        
        const player = (await db.select().from(players).where(eq(players.name, body.name)))[0];
        if (player === undefined) return BuildError(404, "Player not found");

        await db.delete(accounts).where(eq(accounts.player_id, player.id));
        await db.delete(players).where(eq(players.name, body.name));

        return NextResponse.json({});
    } catch(err) {
        return GetError(err);
    }
}