import { FACTIONS, race_names } from "@/db/data";
import z from "zod";
import { PreprocessArrayString } from "../model-helper";

export const GetSchema = z.object({
    factions: z.preprocess(
        PreprocessArrayString,
        z.optional(z.array(z.literal(FACTIONS)))
    ),
    names: z.preprocess(
        PreprocessArrayString,
        z.optional(z.array(z.string()))
    )
});
export type Get = z.infer<typeof GetSchema>;

export const PutSchema = z.object({
    name: z.string(),
    discord_id: z.string(),
    faction: z.literal(FACTIONS),
    race: z.literal(race_names)
});
export type Put = z.infer<typeof PutSchema>;

export const PostSchema = z.object({
    name: z.string(),
    data: z.object({
        gold: z.optional(z.number().positive()),
        self_score: z.optional(z.number().positive()),
        faction_score: z.optional(z.number().positive()),
        faction: z.optional(z.literal(FACTIONS)),
        alive: z.optional(z.boolean()),
        race: z.optional(z.literal(race_names))
    })
});
export type Post = z.infer<typeof PostSchema>;

export const DeleteSchema = z.object({
    name: z.string()
});
export type Delete = z.infer<typeof DeleteSchema>;