import { NextResponse } from "next/server";
import { BuildError } from "../api-error";
import { PostSchema } from "./model";
import { db } from "@/db";
import { accounts, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { JsonRoute } from "../route";

export const POST = JsonRoute(PostSchema, async (body) => {
    const account = (await db.select().from(accounts).where(eq(accounts.name, body.name)))[0];
    if (account === undefined || account.pwd === null) return BuildError(401, "");

    if (!(await bcrypt.compare(body.pwd, account.pwd))) return BuildError(401, "");

    const token = randomBytes(32).toString("hex");
    const store = await cookies();
    const expires = new Date(Date.now());
    expires.setHours(expires.getHours() + 12);

    await db.insert(sessions).values({
        token, expires, account: account.id
    });

    store.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires
    });

    return NextResponse.json({});
});