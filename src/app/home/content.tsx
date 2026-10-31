"use client"

import "./style.css"
import "../globals.css"

import { PlayerRessource } from "@/components/player-ressource/player-ressource";
import { players } from "@/db/schema";
import { Nav } from "./nav";
import { useState } from "react";
import { Faction, faction_color } from "@/db/data";
import { Post, PostSchema } from "../api/kill/model";
import TextBox from "@/components/text-box/text-box";

interface KilledData {
    name: string,
    faction: string
}

export default function Content({ player, targets } : { 
    player: typeof players.$inferSelect, 
    targets: { name: string, faction: string }[] 
}) {
    const playerColors = faction_color(player.faction);
    const targetsDisplay = targets.length === 0 
        ? <p>Votre faction a abattu toutes les cibles du jour, félicitations !</p>
        : targets.map((x, i) => <div key={`target.${i}`} style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }}>
        <p>{x.name} ({x.faction})</p>
        <button onClick={() => setKilled(x)}>Revendiquer</button>
    </div>)

    const [error, setError] = useState("");
    const [killed, setKilled] = useState<KilledData | null>(null);

    const blur = <div style={{
        width: "100vw",
        height: "100vh",
        opacity: killed === null ? "0" : "1",
        pointerEvents: killed === null ? "none" : "auto",
        zIndex: 1,
        backgroundColor: "rgba(165, 165, 165, 0.62)",
        position: "fixed",
        left: "0px",
        top: "0px",
    }}>
        {killed === null ? <div></div> : <div className="main" id="main-form" style={{
            borderColor: playerColors.secondary,
            backgroundColor: playerColors.primary,
            color: playerColors.secondary
        }}>
            <TextBox content={error} setter={setError}></TextBox>

            <p>Vous allez réclamer l'assassinat de {killed.name} ({killed.faction})</p>
            <p>Ajoutez maintenant une preuve à l'image de votre exploit !</p>

            <form onSubmit={(event) => {
                event.preventDefault();

                const data = new FormData(event.currentTarget);
                const query: Post = {
                    query_faction: data.get("query_faction") as Faction,
                    killed: data.get("killed") as string,
                    killer: data.get("killer") as string,
                    proof: data.get("proof") as File
                };

                const parsed = PostSchema.safeParse(query);
                if (!parsed || parsed.data === undefined) setError("Requête invalide, veuillez réessayer")
                else {
                    fetch("/api/kill", { method: "POST", body: data }).then((res) => {
                        if (!res.ok) {
                            setError("Requête invalide, veuillez réessayer");
                            return;
                        }

                        window.location.href = "/";
                    });
                }

                setKilled(null);
            }}>
                <input type="hidden" name="query_faction" value={player.faction}></input>
                <input type="hidden" name="killer" value={player.name}></input>
                <input type="hidden" name="killed" value={killed.name}></input>
                <input type="file" name="proof" accept="image/png, image/jpeg, image/webp" required={true}></input>
                <button type="submit">Envoyer</button>
            </form>
        </div>}
    </div>

    return <div className="main" id="main-home">
        {blur}
        <p>Bienvenue, {player.name} !</p>

        <div style={{
            margin: "5vh"
        }}>
            <p>Faction : {player.faction}</p>
            <p>Classe : {player.race}</p>
        </div>

        <div>
            <p>Statistiques</p>
            {([
                ["coin", player.gold],
                ["s_score", player.self_score],
                ["f_score", player.faction_score]
            ] as const).map(([r, x], i) => <PlayerRessource ressource={r} amount={x} imageVwSize={10} key={`ressource.${i}`}></PlayerRessource>)}
        </div>

        <div>
            <p style={{textAlign: "center"}}>Cibles de faction</p>
            {targetsDisplay}
        </div>

        <Nav></Nav>
    </div>;
}