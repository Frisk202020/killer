import { Day } from "@/db/data";
import z from "zod";

export const GetSchema = z.object({
    id: z.preprocess(
        (x) => typeof x === "string" ? Number.parseInt(x) : Number.NaN,
        Day
    )
});
export type Get = z.infer<typeof GetSchema>;

export const DeleteSchema = z.object({
    id: Day
})
export type Delete = z.infer<typeof DeleteSchema>;

export const PostSchema = z.object({
    id: Day,
    content: z.string(),
    solution: z.string(),
    gold_reward: z.optional(z.number()),
    score_reward: z.optional(z.number())
});
export type Post = z.infer<typeof PostSchema>;

