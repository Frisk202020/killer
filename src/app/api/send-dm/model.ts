import z from "zod";

export const PostSchema = z.object({
    message: z.string(),
    user: z.string()
});
export type Post = z.infer<typeof PostSchema>;