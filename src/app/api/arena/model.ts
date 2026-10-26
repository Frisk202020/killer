import z from "zod"

export const PostSchema = z.object({
    winner: z.string(),
    looser: z.string()
});

export type Post = z.infer<typeof PostSchema>;