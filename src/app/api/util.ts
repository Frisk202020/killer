import { NextResponse } from "next/server";

export const ApiError = (status: number, reason: string) => NextResponse.json(
    { reason },
    { status }
)