import { NextResponse } from "next/server";

export const GetError = (err: any = {}) => {
    switch(err.code) {
        case "SQLITE_CONSTRAINT_UNIQUE": return NextResponse.json({reason: "Duplicate value unauthorized"}, {status: 409});
        default: return NextResponse.json({reason: "Invalid JSON"}, {status: 400})
    }
};

export const BuildError = (status: number, reason: string) => NextResponse.json(
    { reason }, { status }
);