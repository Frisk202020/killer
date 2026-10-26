import { NextResponse } from "next/server";
import { BuildError } from "../api-error";
import { accounts, invitations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { hash } from "@/db/data";
import { JsonRoute } from "../route";
import { PostSchema } from "./model";

export const POST = JsonRoute(PostSchema, async (body) => {
    const invite = (await db.select().from(invitations).where(eq(invitations.token, body.token)))[0];
    if (invite === undefined || invite.expires.getUTCDate() > Date.now()) return BuildError(401, "");

    const account = (await db.select().from(accounts).where(eq(accounts.id, invite.id)))[0];
    if (account === undefined) return BuildError(401, "");

    account.pwd = await hash(body.pwd);
    await db.update(accounts).set(account).where(eq(accounts.id, account.id));

    return NextResponse.json({});
});