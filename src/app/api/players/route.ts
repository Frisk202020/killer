import { db } from "@/db";
import { accounts, invitations, players } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { DeleteSchema, GetSchema, PostSchema, PutSchema } from "./model";
import { BuildError, PlayerNotFound } from "../api-error";
import { randomBytes } from "crypto";
import { GetRoute, AuthenticatedJsonRoute } from "../route";
import Bot from "@/app/discord";
import { route_from_host } from "@/db/data";

export const GET = GetRoute(GetSchema, false, async (body, user) => {
    const filters = [];
    if (body.names !== undefined && body.names.length > 0) filters.push(inArray(players.name, body.names));

    if (user.admin) {
        if (body.factions !== undefined && body.factions.length != 0) filters.push(inArray(players.faction, body.factions));
    } else {
        if (user.player_id === null) return BuildError(401, "");

        const player = (await db.select().from(players).where(eq(players.id, user.player_id)))[0];
        if (user.player_id === null) return BuildError(401, "");

        filters.push(eq(players.faction, player.faction));
    }
    
    return NextResponse.json(
        { data: await db.select().from(players).where(and(...filters)) }
    )
});  

export const PUT = AuthenticatedJsonRoute(PutSchema, true, async (body) => {
    const res = await db.insert(players).values({
        name: body.name,
        faction: body.faction,
        race: body.race
    });

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now());
    expires.setHours(expires.getHours() + 1);

    const account = await db.insert(accounts).values({ name: body.name, discord_id: body.discord_id, player_id: res.lastInsertRowid as number }).onConflictDoNothing();
    if (account.changes === 0) {
        await db.delete(players).where(eq(players.id, res.lastInsertRowid as number));
        return BuildError(409, "Name or Discord Id already in use");
    }
    
    await db.insert(invitations).values({ id: account.lastInsertRowid as number, token, expires });

    Bot.Dm(
        `Vous avez été invité en tant que joueur pour le Killer !\n\nVeuillez finaliser la création de votre compte joueur en cliquant sur ce [lien](${route_from_host(`/welcome/${token}`)}).\n\n**Attention, ce lien est à usage unique !**`,
        body.discord_id
    );

    return NextResponse.json({});
});

export const POST = AuthenticatedJsonRoute(PostSchema, true, async (body) => {
    const data: any = (await db.select().from(players).where(eq(players.name, body.name)))[0];
    if (data === undefined) return BuildError(400, "Player not found");

    for (const [k, v] of Object.entries(body.data)) {
        if (v !== null) data[k] = v;
    }

    const res = await db.update(players).set(data).where(eq(players.name, body.name));
    return NextResponse.json(
        { changes: res.changes, input: body.data, data }
    );
});

export const DELETE = AuthenticatedJsonRoute(DeleteSchema, true, async (body) => {
    const player = (await db.select().from(players).where(eq(players.name, body.name)))[0];
    if (player === undefined) return PlayerNotFound;

    await db.delete(players).where(eq(players.id, player.id));
    return NextResponse.json({});
});