import z from "zod";
import publicConfig from "../../../../discord-public.json"

type Roles = keyof typeof publicConfig.roles;
const roleKeys = Object.keys(publicConfig.roles) as Roles[];


export const PostSchema = z.object({
    message_components: z.array(z.discriminatedUnion("type", [
        z.object({
            type: z.literal("message"),
            content: z.string()
        }),
        z.object({
            type: z.literal("ping_user"),
            content: z.string()
        }),
        z.object({
            type: z.literal("ping_role"),
            content: z.literal(roleKeys)
        })
    ])),
    channel: z.literal(Object.keys(publicConfig.channels) as Array<keyof typeof publicConfig.channels>)
});
export type Post = z.infer<typeof PostSchema>;