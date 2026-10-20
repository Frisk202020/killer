import { and, eq, ne, notInArray } from "drizzle-orm";
import { db } from ".";
import { Faction } from "./data";
import { faction_targets, players } from "./schema";

export async function new_target(query_faction: Faction): Promise<boolean> {
    const exclude = (await db.select().from(faction_targets).where(and(
        eq(faction_targets.faction, query_faction),
    ))).map((x) => x.id);

    const targets = await db.select().from(players).where(and(
        ne(players.faction, query_faction),
        notInArray(players.id, exclude)
    ));

    const maxWeight = targets.map((x) => x.target_weight).reduce((a, b) => a + b, 0);
    const chosen_weight = Math.random() * maxWeight;

    let choice = -1;
    let sumWeight = 0
    for (let i = 0; i < targets.length; i++) {
        sumWeight += targets[i].target_weight;
        if (chosen_weight < sumWeight) {
            choice = i;
            break;
        }
    }

    if (choice === -1) return false;

    await db.update(players).set({target_weight: Math.max(targets[choice].target_weight - 5, 10)}).where(eq(players.name, targets[choice].name));
    await db.insert(faction_targets).values({
        faction: query_faction,
        target: targets[choice].id,
    });

    return true;
}