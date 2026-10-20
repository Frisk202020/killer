import { db } from "@/db";
import { BASE_TARGETS_COUNT, FACTIONS } from "@/db/data";
import { faction_targets } from "@/db/schema";
import { new_target } from "@/db/targets";
import { NextResponse } from "next/server";
import { BuildError } from "../util";

/**
 * Admin
 */
export async function POST(request: Request): Promise<NextResponse> {
    await db.delete(faction_targets);

    for (const faction of FACTIONS) {
        for (let i = 0; i < BASE_TARGETS_COUNT; i++) {
            if (!(await new_target(faction))) return BuildError(500, `Not enough targets for ${faction}`);
        }
    }

    return NextResponse.json({});
}