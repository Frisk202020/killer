import { db } from "@/db";
import { Faction, Race } from "@/db/data";
import { players } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


export interface Body {
    name: string,
    faction: Faction,
    race: Race
}

export async function GET(request: Request) {
    const x = await db.select().from(players);
    return NextResponse.json(
        { data: x }
    )
}

export async function PUT(request: Request) {
    try {
        const body: Body = await request.json();

        const x = await db.insert(players).values({
            name: body.name,
            faction: body.faction,
            race: body.race
        });
        
        revalidatePath("/items");
        return NextResponse.json({
            changes: x.changes
        });
    } catch(error) {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 } 
        )
    }    
}