import z from "zod";

export const PostSchema = z.object({
    message: z.string()
});
export type Post = z.infer<typeof PostSchema>;