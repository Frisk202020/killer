import z from "zod";

export const PostSchema = z.object({
    name: z.string(),
    pwd: z.string()
});
export type Post = z.infer<typeof PostSchema>;