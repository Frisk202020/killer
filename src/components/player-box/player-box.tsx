import "./style.css"
import { faction_color } from "@/db/data";
import { players } from "@/db/schema";
import { PlayerRessource } from "../player-ressource/player-ressource";

export default function PlayerBox({ data, style } : {
    data: typeof players.$inferSelect,
    style: {
        width: number,
        height: number
    }
}) {
    return <div className="player-box" style={{
        width: `${style.width}vw`, 
        height: `${style.height}vh`,
        borderColor: faction_color(data.faction).secondary
    }}>
        <img src={`races/${data.race}.png`}></img>
        <div>
            <p><b>{data.name}</b></p>
            {([
                ["coin", data.gold],
                ["s_score", data.self_score],
                ["f_score", data.faction_score],
                ["token", data.arena_tokens],
                ["a_score", data.arena_tokens]
            ] as const).map(([r, x]) => <PlayerRessource ressource={r} amount={x} imageVwSize={10}></PlayerRessource>)}
        </div>
    </div>
}