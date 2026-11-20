"use client"

import "./style.css"
import "../style.css"
import "../../globals.css"

import { PlayerRessource } from "@/components/player-ressource/player-ressource";
import { Faction, faction_colors, prefers_dark } from "@/db/data";
import { Player } from "@/db/schema";
import { Nav } from "../nav";
import { CSSProperties, useEffect, useState } from "react";
import ImageButton from "@/components/image-button";
import { Post } from "@/app/api/arena/model";
import client_error from "@/app/api/arena/client-errors";
import { Severity } from "@/app/api/client-errors";
import TextBox from "@/components/text-box/text-box";
import ObjectInFront from "@/components/object-in-front/object-in-front";

interface Opponent {
    name: string,
    faction: Faction,
    bg: string,
    border: string
}

export function Content({ player, team, opponents } : { 
    player: Player,
    team: { members: Player[], faction: Faction }, 
    opponents: { name: string, faction: Faction, alive: boolean, s_score: number, a_score: number, can_battle: boolean }[] }
) {
    const [opponentArena, setOpponentArena] = useState("");
    const [opponentKill, setOpponentKIll] = useState<Opponent|null>(null);
    const [error, setError] = useState("");

    const [dark, setDark] = useState(false);
    useEffect(() => setDark(prefers_dark()), []);

    const teamColors = faction_colors(player.faction, dark);
    useEffect(() => setDark(prefers_dark()), []);

    const formArena = <div className="form" style={{
        backgroundColor: teamColors["background-objects"], 
        borderColor: teamColors.color,
        color: teamColors.color
    }}>
        <p>{`Voulez vous déclarer une victoire d'arène contre ${opponentArena} ?`}</p>

        <div className="form-buttons">
            <button onClick={() => {
                const body: Post = {
                    winner: player.name,
                    looser: opponentArena
                };

                fetch("/api/arena", { method: "POST", body: JSON.stringify(body) }).then((res) => {
                    if (res.ok) window.location.reload();
                    else {
                        const err = client_error(res.status, "HOME-PLAYERS-01");
                        switch (err.severity) {
                            case Severity.Unauthorized: window.location.href = "/";
                            default: setError(err.text);        
                        } 

                        setOpponentArena("");
                    }
                })
            }}>Confirmer</button>
            <button onClick={() => setOpponentArena("")}>Annuler</button>
        </div>
    </div>;

    const formKill = opponentKill === null ? <div></div> : <div 
        className="form" 
        style={{backgroundColor: opponentKill.bg, borderColor: opponentKill.border}}
    >
        <p>Vous allez réclamer l'assassinat de {opponentKill.name} ({opponentKill.faction})</p>
        <p style={{margin: "2vh"}}>Ajoutez maintenant une preuve à l'image de votre exploit !</p>

        <form onSubmit={(event) => {
            event.preventDefault();

            const data = new FormData(event.currentTarget);
            fetch("/api/kill", { method: "POST", body: data }).then((res) => {
                if (!res.ok) {
                    setError("Requête invalide, veuillez réessayer");
                    setOpponentKIll(null)
                    return;
                }

                window.location.href = "";
            });            
        }} style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <input type="hidden" name="query_faction" value={player.faction}></input>
            <input type="hidden" name="killer" value={player.name}></input>
            <input type="hidden" name="killed" value={opponentKill.name}></input>
            <input type="file" name="proof" accept="image/png, image/jpeg, image/webp" required={true}></input>

            <div className="form-buttons">
                <button type="submit">Envoyer</button>
                <button onClick={() => setOpponentKIll(null)}>Annuler</button>
            </div>
        </form>
    </div>

    const imgWidth = 7;
    const imgStyle: (backgroundColor: string, borderColor: string) => CSSProperties = (backgroundColor, borderColor) => ({
        width: `${imgWidth}vw`,
        borderRadius: "1vw",
        border: "solid .5vw",
        borderColor, backgroundColor
    });
    const inactiveStyle = imgStyle("#c5c4c4", "#686868");

    const teamDisplay = team.members.map((x, i) => {
        const btnEnabled = x.name !== player.name && player.arena_tokens > 0 && x.arena_tokens > 0;

        return <div 
            className="player-box" 
            style={{
                borderColor: teamColors.color, 
                backgroundColor: teamColors["background-objects"],
                color: teamColors.color
            }}
            key={`team.${i}`}
        >
            <p style={{textAlign: "center"}}><b>{x.name}</b></p>
            <div style={{display: "flex", flexDirection: "row"}}>
                <div>
                    {([
                        ["coin", x.gold],
                        ["s_score", x.self_score],
                        ["f_score", x.faction_score]
                    ] as const).map(([x, y], i) => <PlayerRessource ressource={x} amount={y} imageVwSize={imgWidth} key={`team.res.${i}`}></PlayerRessource>)}
                </div><div>
                    {([
                        ["token", x.arena_tokens],
                        ["a_score", x.arena_victories]
                    ] as const).map(([x, y], i) => <PlayerRessource ressource={x} amount={y} imageVwSize={imgWidth} key={`team.ares.${i}`}></PlayerRessource>)}
                </div>
            </div>
            
            <ImageButton 
                src={`/nav/arena${btnEnabled ? "" : "_locked"}.png`} 
                style={btnEnabled ? imgStyle(teamColors["background-primary"], teamColors.color) : inactiveStyle} 
                onclick={() => { if (btnEnabled) setOpponentArena(x.name) }}
            ></ImageButton>
        </div>
    });

    const opponentDisplay = opponents.map((x, i) => {
        const arenaEnabled = player.arena_tokens > 0 && x.can_battle;
        const killEnabled = player.alive && x.alive;
        const colors = faction_colors(x.faction, dark);

        return <div key={`opp.${i}`} className="player-box" style={{
            backgroundColor: colors["background-objects"], 
            borderColor: colors.color,
            color: colors.color
        }}>
            <p><b>{x.name}</b></p>
            <div style={{display: "flex", flexDirection: "row"}}>
                <PlayerRessource ressource={"s_score"} amount={x.s_score} imageVwSize={imgWidth}></PlayerRessource>
                <PlayerRessource ressource={"a_score"} amount={x.a_score} imageVwSize={imgWidth}></PlayerRessource>
            </div>

            <div style={{marginTop: "2vh", display: "flex", justifyContent: "space-around", width: "80%"}}>
                <ImageButton 
                    src={`/nav/arena${arenaEnabled ? "" : "_locked"}.png`} 
                    style={arenaEnabled ? imgStyle(colors["background-primary"], colors.color) : inactiveStyle}
                    onclick={() => { if (arenaEnabled) setOpponentArena(x.name) }}
                ></ImageButton>

                <ImageButton 
                    src="/nav/target.png" 
                    style={killEnabled ? imgStyle(colors["background-primary"], colors.color) : inactiveStyle}
                    onclick={() => { if (killEnabled) setOpponentKIll({
                        name: x.name, faction: x.faction, bg: colors["background-primary"], border: colors.color
                    }) }}
                ></ImageButton>
            </div>
        </div>
    });

    return <div className="main" id="main-home">
        <TextBox content={error} setter={setError}></TextBox>
        <ObjectInFront object={formArena} enabled={opponentArena !== ""}></ObjectInFront>
        <ObjectInFront object={formKill} enabled={opponentKill !== null}></ObjectInFront>

        <p>Liste des joueurs</p>
        {teamDisplay.concat(opponentDisplay)}
        <Nav></Nav>
    </div>;
}