"use client"

import { PlayerRessource } from "@/components/player-ressource/player-ressource"
import "../../globals.css"
import { Nav } from "../nav"
import { PostSchema } from "@/app/api/arena/model"
import { useState } from "react"
import TextBox, { BoxType } from "@/components/text-box/text-box"

export default function Content({ name, arena_tokens, arena_victories } : { name: string, arena_tokens: number, arena_victories: number }) {
    const [warn, setWarn] = useState("");
    const [error, setError] = useState("");

    return <div className="main" style={{padding: "5vh"}}>
        <TextBox content={warn} setter={setWarn} type={BoxType.Warn}></TextBox>
        <TextBox content={error} setter={setError}></TextBox>

        <p>Vos ressources d'arène</p>

        {([
            ["token", arena_tokens],
            ["a_score", arena_victories]
        ] as const).map(([r, value], i) => <PlayerRessource ressource={r} amount={value} imageVwSize={10} key={`ressource.${i}`}></PlayerRessource>)}

        {arena_tokens > 0 
            ? <form className="main" onSubmit={(event) => {
                event.preventDefault();

                const data = new FormData(event.currentTarget);
                const body = {
                    winner: name,
                    looser: data.get("name")
                };

                const parsed = PostSchema.safeParse(body);
                if (!parsed || parsed.data === undefined) {
                    setError("Veuillez saisir un nom de joueur");
                    return;
                }

                fetch("/api/arena", { method: "POST", body: JSON.stringify(parsed.data) }).then((res) => {
                    if (res.ok)  window.location.reload();
                    else {
                        switch(res.status) {
                            case 401: window.location.href = "/";
                            case 404: setWarn("Ce joueur n'existe pas"); break;
                            case 409: setWarn("Vous ou votre adversaire n'avez plus de jetons d'arène"); break;
                            default: setError("[HOME-ARENA-01] Une erreur interne est survenue");
                        }
                    }
                });
            }}>
                <p>Vous avez gagné un combat d'arène ?</p>
                <input name="name" style={{margin: "5vh"}} type="text" required={true} placeholder="Nom de votre adversaire"></input>
                <button type="submit">Envoyer</button>
            </form>
            
            : <p>Vous avez utilisé tous vos jetons du jour !</p>
        }  

        <Nav></Nav>
    </div>
}