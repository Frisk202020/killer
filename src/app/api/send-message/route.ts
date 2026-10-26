import { bot_sends } from "@/app/discord";
import { AuthenticatedJsonRoute } from "../route";
import { PostSchema } from "./model";
import { NextResponse } from "next/server";

export const POST = AuthenticatedJsonRoute(PostSchema, true, async (body) => {
    bot_sends(body.message);
    return NextResponse.json({});
});