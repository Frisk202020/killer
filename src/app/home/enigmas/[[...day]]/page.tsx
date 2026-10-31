import { db } from "@/db";
import { Base, Params } from "../../base";
import { enigmas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CURRENT_DAY } from "@/db/data";
import Content from "./content";
import { Forbidden } from "./forbidden";

export const instant = false;

type Query = Params<{ day: [number] | undefined }>
const Enigmas = (request: Query) => Base<Query>(async (player) => {
    const { day } = await request.params;
    const actualDay = day === undefined ? CURRENT_DAY : day[0];

    if (actualDay > CURRENT_DAY) return <Forbidden></Forbidden>;

    const enigma = (await db.select({content: enigmas.content}).from(enigmas).where(eq(enigmas.id, actualDay)))[0];
    if (enigma === undefined) return <Forbidden></Forbidden>;

    return <Content enigma={enigma.content} faction={player.faction} day={actualDay}></Content>
}, request);

export default Enigmas;