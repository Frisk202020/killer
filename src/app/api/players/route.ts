import { db } from "@/db";
import { Faction, players, Race } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


interface Body {
    name: string,
    faction: Faction,
    race: Race
}

export async function PUT(request: Request) {
    try {
        const body: Body = await request.json();

        db.insert(players).values({
            name: body.name,
            faction: body.faction,
            race: body.race
        });
    } catch(error) {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 } 
        )
    }

    revalidatePath("/items");
}