import { FACTIONS } from "@/db/data";
import z from "zod";

export const GetSchema = z.object({
    faction: z.literal(FACTIONS)
});
export type Get = z.infer<typeof GetSchema>;

export const Schema = z.object({
    faction: z.literal(FACTIONS),
    target: z.string()
});
type Body = z.infer<typeof Schema>;

export type Put = Body;
export type Delete = Body;