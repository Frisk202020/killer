import { players } from "@/db/schema";
import { connection } from "next/server";
import { JSX } from "react/jsx-runtime";
import { authenticate } from "../api/authenticate";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";

type Target<T> = (player: typeof players.$inferSelect, request: T) => Promise<JSX.Element>; 
export type Params<T> = {
    params: Promise<T>
}

export async function Base<T>(f: Target<T>, request: T) {
    await connection();
    
    const user = await authenticate();
    if (user === null) redirect("/login");
    if (user.player_id === null) redirect(user.admin ? "/admin" : "/login");

    const data = (await db.select().from(players).where(eq(players.id, user.player_id)))[0];
    if (data === undefined) redirect("/login");

    return await f(data, request);
}

export const VoidBase = async (f: Target<undefined>) => Base(f, undefined);