import { NextResponse } from "next/server";
import { z, ZodObject } from "zod"
import { BuildError, GetError } from "./api-error";
import { authenticate, User } from "./authenticate";

type AuthenticatedBody<T> = (body: T, user: User) => Promise<NextResponse>;
type Body<T> = (body: T) => Promise<NextResponse>;
type Route = (request: Request) => Promise<NextResponse>;

export const GetRoute = <T extends ZodObject>(schema: T, adminOnly: boolean, f: AuthenticatedBody<z.infer<T>>): Route => async (request: Request) => {
    const user = await authenticate();
    if (user === null || adminOnly && !user.admin) return BuildError(401);
    
    const data: any = {};
    const url = new URL(request.url);

    for (const k of Object.keys(schema.shape)) {
        const v = url.searchParams.get(k);
        if (v !== null) data[k] = v;
    }

    const parsed = schema.safeParse(data);
    if (!parsed.success) return BuildError(400, parsed.error.message);

    return f(parsed.data, user);
}

export const JsonRoute = <T extends ZodObject>(schema: T, f: Body<z.infer<T>>): Route => async (request: Request) => {
    try {
        const body = await request.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) return BuildError(400, parsed.error.message);

        return f(parsed.data);
    } catch(err) {
        return GetError(err);
    }
}

async function get_body(request: Request, asFormData: boolean) {
    if (asFormData) {
        const data = await request.formData();
        return Object.fromEntries(data);
    }

    return await request.json();
}

export const AuthenticatedJsonRoute = <T extends ZodObject>(
    schema: T, 
    adminOnly: boolean, 
    f: AuthenticatedBody<z.infer<T>>,
    asFormData: boolean = false
): Route => async (request) => {
    const user = await authenticate();
    if (user === null || adminOnly && !user.admin) return BuildError(401);

    try {
        const body = await get_body(request, asFormData);
        const parsed = schema.safeParse(body);
        if (!parsed.success) return BuildError(400, parsed.error.message);

        return f(parsed.data, user);
    } catch(err) {
        return GetError(err);
    }
}