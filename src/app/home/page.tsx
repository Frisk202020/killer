import { db } from "@/db";
import { faction_targets, players } from "@/db/schema";
import { eq } from "drizzle-orm";
import Content from "./content";
import { VoidBase } from "./base";

export const instant = false;

const Home = () => VoidBase(async (player) => {
    const targets = (await db.select({name: players.name, faction: players.faction})
        .from(faction_targets).where(eq(faction_targets.faction, player.faction))
        .innerJoin(players, eq(faction_targets.target, players.id)));

    return <Content player={player} targets={targets}></Content>
});
export default Home;