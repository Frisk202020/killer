import { getDay } from "@/db/data";
import { NextResponse } from "next/server";
import { BuildError, GetError } from "../error";
import { db } from "@/db";
import { enigmas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DeleteBody, PostBody } from "./model";

/**
 * Everyone
 */
export async function GET(request: Request): Promise<NextResponse> {
    const url = new URL(request.url);
    const id = getDay(url.searchParams.get("id"));
    if (id === null) return BuildError(400, "Invalid ID");

    const data = (await db.select().from(enigmas).where(eq(enigmas.id, id)))[0];
    return data === undefined
        ? BuildError(404, `Enigma not defined for day ${id}`)
        : NextResponse.json({ data });
}

/**
 * Admin
 */
export async function POST(request: Request): Promise<NextResponse> {
    try {    
        const body: PostBody = await request.json();

        const id = getDay(body.id);
        if (id === null || !body.content) return BuildError(400, "Missing parameters");

        await db.insert(enigmas)
            .values({id, content: body.content})
            .onConflictDoUpdate({target: enigmas.id, set: {content: body.content}});

        return NextResponse.json({})
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

        const id = getDay(body.id);
        if (id === null) return BuildError(400, "Invalid day");

        await db.delete(enigmas).where(eq(enigmas.id, id));
        return NextResponse.json({});
    } catch(err) {
        return GetError(err);
    }
}