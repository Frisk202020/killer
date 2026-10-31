import Bot from "@/app/discord";
import { AuthenticatedJsonRoute } from "../route";
import { PostSchema } from "./model";
import { NextResponse } from "next/server";

export const POST = AuthenticatedJsonRoute(PostSchema, false, async (body) => {
    Bot.Send(
        body.message_components.map((x) => {
            switch(x.type) {
                case "message": return x.content;
                case "ping_role": return Bot.PingRole(x.content);
                case "ping_user": return Bot.PingUser(x.content);
            }
        }).join(" "), 
        body.channel
    );

    return NextResponse.json({});
});