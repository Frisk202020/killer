"use client"

import "./style.css"
import "../globals.css"

import { PlayerRessource } from "@/components/player-ressource/player-ressource";
import type { Player } from "@/db/schema";
import { Nav } from "./nav";
import { useEffect, useState } from "react";
import { default_colors, Faction, faction_colors, prefers_dark } from "@/db/data";
import { Post, PostSchema } from "../api/kill/model";
import TextBox from "@/components/text-box/text-box";
import ObjectInFront from "@/components/object-in-front/object-in-front";
import Icon from "@/components/icon";
import FileInput from "@/components/file-input";

interface KilledData {
    name: string,
    faction: string
}

export default function Content({ player, targets } : { 
    player: Player, 
    targets: { name: string, faction: Faction }[] 
}) {
    const [playerColors, setPlayerColors] = useState(default_colors);
    const [dark, setDark] = useState(false);
    useEffect(() => {
        setDark(prefers_dark());
        setPlayerColors(faction_colors(player.faction, dark))
    }, []);    

    const targetsDisplay = targets.length === 0 
        ? <p>Votre faction a abattu toutes les cibles du jour, félicitations !</p>
        : targets.map((x, i) => {
            const colors = faction_colors(x.faction, dark);

            return <div key={`target.${i}`} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: colors.color
                }
            }>
                <div style={{display: "flex"}}>
                    <Icon name="skull" style={{margin: "0", marginRight: "5vw"}}></Icon>
                    <p style={{margin: "0", color: colors.color}}>{x.name} ({x.faction})</p>
                </div>
                <button onClick={() => setKilled(x)} style={{
                    color: colors.color,
                    borderColor: colors.color,
                    backgroundColor: colors["background-objects"]
                }}>Revendiquer</button>
            </div>
        })

    const [error, setError] = useState("");
    const [killed, setKilled] = useState<KilledData | null>(null);

    const blur = <ObjectInFront object={killed === null ? <div></div> : <div className="main" id="main-form" style={{
        borderColor: playerColors.color,
        backgroundColor: playerColors["background-secondary"],
        color: playerColors.color
    }}>
        <TextBox content={error} setter={setError}></TextBox>
        <Icon name="cancel" style={{
            position: "fixed",
            float: "left",
            top: "5%",
            right: "10%"
        }} action={() => setKilled(null)}></Icon>

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
            <FileInput id="proof" accept={["webp", "png", "jpeg"].map((x) => `image/${x}`)} required={true} label="Ajouter une preuve"></FileInput>
            
            <button type="submit">Envoyer</button>
        </form>
    </div>} enabled={killed !== null}></ObjectInFront>

    const statsColor = playerColors["background-objects"] + "7c";
    return <div className="main" id="main-home">
        {blur}
        <p><b>Bienvenue, {player.name} !</b></p>

        <div id="profile" className="box" style={{backgroundColor: statsColor, position: "relative"}}>
            <Icon name="person" className="box-icon"></Icon>
            <p><b>Profil</b></p>
            <div>
                <p>Faction : {player.faction}</p>
                <p>Classe : {player.race}</p>
            </div>
        </div>

        <div className="box" style={{backgroundColor: statsColor, position: "relative"}}>
            <Icon name="leaderboard" className="box-icon"></Icon>
            <p><b>Statistiques</b></p>
            {([
                ["coin", player.gold],
                ["s_score", player.self_score],
                ["f_score", player.faction_score]
            ] as const).map(([r, x], i) => <PlayerRessource ressource={r} amount={x} imageVwSize={10} key={`ressource.${i}`}></PlayerRessource>)}
        </div>

        <div className="space-between box" style={{backgroundColor: statsColor, position: "relative"}}>
            <Icon name="target" className="box-icon"></Icon>
            <p style={{textAlign: "center"}}><b>Cibles de faction</b></p>
            {targetsDisplay}
        </div>

        <Nav></Nav>
    </div>;
}