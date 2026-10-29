import { FACTIONS } from "@/db/data";
import z from "zod";

export const PostSchema = z.object({
    query_faction: z.literal(FACTIONS),
    killed: z.string(),
    killer: z.string(),
    proof: z.file()
});
export type Post = z.infer<typeof PostSchema>;