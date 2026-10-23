import { NextResponse } from "next/server";
import { BuildError, GetError } from "../error";
import { PostBody } from "./model";
import { accounts, invitations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { hash } from "@/db/data";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body: PostBody = await request.json();
        if (!body.token || !body.pwd) return BuildError(401, "");

        const invite = (await db.select().from(invitations).where(eq(invitations.token, body.token)))[0];
        if (invite === undefined || invite.expires.getUTCDate() > Date.now()) return BuildError(401, "");

        const account = (await db.select().from(accounts).where(eq(accounts.id, invite.id)))[0];
        if (account === undefined) return BuildError(401, "");

        account.pwd = await hash(body.pwd);
        await db.update(accounts).set(account).where(eq(accounts.id, account.id));

        return NextResponse.json({});
    } catch(err) {
        return GetError(err);
    }
}