import { DAYS_HIGHER_BOUND, DAYS_LOWER_BOUND } from "@/db/data";
import z from "zod";

const day = z.number().min(DAYS_LOWER_BOUND).max(DAYS_HIGHER_BOUND);

export const GetSchema = z.object({
    id: z.preprocess(
        (x) => typeof x === "string" ? Number.parseInt(x) : Number.NaN,
        day
    )
});
export type Get = z.infer<typeof GetSchema>;

export const DeleteSchema = z.object({
    id: day
})
export type Delete = z.infer<typeof DeleteSchema>;

export const PostSchema = z.object({
    id: day,
    content: z.string()
});
export type Post = z.infer<typeof PostSchema>;

