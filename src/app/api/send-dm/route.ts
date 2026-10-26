import { bot_dms } from "@/app/discord";
import { AuthenticatedJsonRoute } from "../route";
import { PostSchema } from "./model";
import { NextResponse } from "next/server";

export const POST = AuthenticatedJsonRoute(PostSchema, true, async (body) => {
    bot_dms(body.message, body.user);
    return NextResponse.json({});
});