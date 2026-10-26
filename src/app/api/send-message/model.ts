import z from "zod";
import publicConfig from "../../../../discord-public.json"

export const PostSchema = z.object({
    message: z.string(),
    channel: z.literal(Object.keys(publicConfig.channels) as Array<keyof typeof publicConfig.channels>)
});
export type Post = z.infer<typeof PostSchema>;