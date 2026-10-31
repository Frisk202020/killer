import { Day, FACTIONS } from "@/db/data";
import z from "zod";

export const PostSchema = z.object({
    faction: z.literal(FACTIONS),
    day: Day,
    solution: z.string()
});
export type Post = z.infer<typeof PostSchema>;

export const PostOutputSchema = z.object({
    rank: z.number()
});
export type PostOutput = z.infer<typeof PostOutputSchema>;
