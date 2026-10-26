import { z, ZodObject } from "zod";

export const PreprocessArrayString = (x: unknown) => typeof x === "string" ? x.split(",") : x;

export const BuildGetParams = <T extends ZodObject>(schema: T, params: z.infer<T>) => Object.entries(params)
    .map(([k, v]) => [k, v] as const)
    .filter(([k, v]) => v !== null && v !== undefined && v.toString !== undefined)
    .map(([k, v]) => `${k}=${v instanceof Array ? v.join(",") :  v!.toString()}`)
    .join("&");