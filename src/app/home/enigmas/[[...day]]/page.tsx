import { db } from "@/db";
import { Base, Params } from "../../base";
import { enigmas, solved_enigmas } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { CURRENT_DAY } from "@/db/data";
import Content from "./content";
import { Forbidden } from "./forbidden";

export const instant = false;

function parse(day?: [string]): number {
    if (day === undefined || day[0] === undefined) return CURRENT_DAY;

    const n = Number.parseInt(day[0]);
    return Number.isNaN(n) ? CURRENT_DAY : n;
}

type Query = Params<{ day: [string] | undefined }>
const Enigmas = (request: Query) => Base<Query>(async (player) => {
    const { day } = await request.params;
    const actualDay = parse(day);

    if (actualDay > CURRENT_DAY) return <Forbidden></Forbidden>;

    const enigma = (await db.select({content: enigmas.content, day: enigmas.id}).from(enigmas).where(eq(enigmas.id, actualDay)))[0];
    if (enigma === undefined) return <Forbidden></Forbidden>;

    const solved = (await db.select()
        .from(solved_enigmas)
        .where(and(eq(solved_enigmas.enigma, enigma.day), eq(solved_enigmas.faction, player.faction)))
    ).length > 0;

    return <Content enigmaContent={enigma.content} enigmaSolved={solved} faction={player.faction} day={actualDay}></Content>
}, request);

export default Enigmas;