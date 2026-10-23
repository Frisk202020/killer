import { NextResponse } from "next/server";
import { BuildError, GetError } from "../error";
import { PostBody } from "./model";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body: PostBody = await request.json();
        if (!body.name || !body.pwd) return BuildError(401, "");

        const account = (await db.select().from(accounts).where(eq(accounts.name, body.name)))[0];
        if (account === undefined || account.pwd === null) return BuildError(401, "");

        if (!(await bcrypt.compare(body.pwd, account.pwd))) return BuildError(401, "");

        const token = randomBytes(32).toString("hex");
        const store = await cookies();
        const expires = new Date(Date.now());
        expires.setHours(expires.getHours() + 12);

        store.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires
        });

        return NextResponse.json({});
    } catch(err) {
        return GetError(err);
    }
}