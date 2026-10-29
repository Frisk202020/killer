import { redirect } from "next/navigation";
import { authenticate } from "../api/authenticate";
import { db } from "@/db";
import { faction_targets, players } from "@/db/schema";
import { eq } from "drizzle-orm";
import Content from "./content";
import { connection } from "next/server";

export const instant = false;

export default async function Home() {
    await connection();

    const user = await authenticate();
    if (user === null) redirect("/login");
    if (user.player_id === null) redirect(user.admin ? "/admin" : "/login");

    const data = (await db.select().from(players).where(eq(players.id, user.player_id)))[0];
    if (data === undefined) redirect("/login");

    const targets = (await db.select({name: players.name, faction: players.faction})
        .from(faction_targets).where(eq(faction_targets.faction, data.faction))
        .innerJoin(players, eq(faction_targets.target, players.id)));

    return <Content player={data} targets={targets}></Content>
}