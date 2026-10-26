import { NextResponse } from "next/server";
import { BuildError } from "../api-error";
import { db } from "@/db";
import { enigmas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AuthenticatedJsonRoute, GetRoute } from "../route";
import { GetSchema, PostSchema, DeleteSchema } from "./model";

export const GET = GetRoute(GetSchema, false, async (body) => {
    const data = (await db.select().from(enigmas).where(eq(enigmas.id, body.id)))[0];
    return data === undefined
        ? BuildError(404, `Enigma not defined for day ${body.id}`)
        : NextResponse.json({ data });
}); 

export const POST = AuthenticatedJsonRoute(PostSchema, true, async (body) => {
    await db.insert(enigmas)
        .values({id: body.id, content: body.content})
        .onConflictDoUpdate({target: enigmas.id, set: {content: body.content}});

    return NextResponse.json({})
}); 

export const DELETE = AuthenticatedJsonRoute(DeleteSchema, true, async (body) => {
    await db.delete(enigmas).where(eq(enigmas.id, body.id));
    return NextResponse.json({});
}); 