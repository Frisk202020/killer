"use client"

import "../../../globals.css"

import { PostOutputSchema, PostSchema } from "@/app/api/solve/model";
import { CURRENT_DAY, type Faction } from "@/db/data";
import { Nav } from "../../nav";
import TextBox, { BoxType } from "@/components/text-box/text-box";
import { useState } from "react";
import { Post } from "@/app/api/send-message/model";

export default function Content({ enigma, day, faction } : { enigma: string, day: number, faction: Faction }) {
    const [text, setText] = useState("");
    const [warn, setWarn] = useState("");
    const [error, setError] = useState("");
    const [hintEnabled, setHint] = useState(true);

    return <div className="main" style={{padding: "5vh"}}>
        <TextBox content={text} setter={setText} type={BoxType.Info}></TextBox>
        <TextBox content={warn} setter={setWarn} type={BoxType.Warn}></TextBox>
        <TextBox content={error} setter={setError}></TextBox>

        <p><b>JOUR {day}</b></p>

        <p>"{enigma}"</p>
        
        <form style={{margin: "10vh"}} className="main" onSubmit={(event) => {
            event.preventDefault();

            const data = new FormData(event.currentTarget);
            const body = {
                day,
                faction,
                solution: data.get("solution")
            }

            const parsed = PostSchema.safeParse(body);
            if (!parsed || parsed.data === null) {
                setError("Solution invalide");
                return;
            }

            fetch("/api/solve", { method: "POST", body: JSON.stringify(parsed.data) }).then(async (res) => {
                if (!res.ok) {
                    switch(res.status) {
                        case 401: setError("Vous n'êtes pas autorisé à résoudre pour cette faction."); break;
                        case 403: setError("Cette énigme n'est pas encore parue."); break;
                        case 404: setError("Aucune énigme n'a été trouvée."); break;
                        case 406: setWarn("La solution n'est pas correcte"); break;
                        case 409: setWarn("Votre faction a déjà résolu cette énigme."); break;
                        default: setError("[HOME-ENIGMAS-1] Une erreur interne s'est produite."); break;
                    }
                } else {
                    const body = await res.json();
                    const parsed = PostOutputSchema.safeParse(body);
                    const suffix = parsed.success && parsed.data !== null ? ` Votre faction finit n°${parsed.data.rank} pour cette énigme.` : "";

                    setText(`Vous avez résolu cette énigme !${suffix}`);
                }
            });
        }}>
            <p>Votre faction a trouvé la solution ?</p>
            <input name="solution" style={{margin: "5vh"}} type="text" required={true} placeholder="proposition de solution"></input>
            <button type="submit">Soumettre une solution</button>
        </form>

        <p style={{margin: "5vh"}}>Votre faction a besoin d'aide ?</p>
        <button onClick={() => {
            if (!hintEnabled) return;
            setHint(false);

            const body: Post = {
                message_components: [
                    { type: "ping_role", content: "admin" },
                    { type: "message", content: "Les"},
                    { type: "ping_role", content: faction },
                    { type: "message", content: `demandent un indice pour l'énigme ${day === CURRENT_DAY ? "d'aujourd'hui" : `du jour ${day}`}`}
                ], channel: "debug"
            };
            
            fetch("/api/send-message", { method: "POST", body: JSON.stringify(body) }).then((res) => {
                if (res.ok) setText("Une demande d'indice a été envoyée aux organisateurs.");
                else setError("[HOME-ENIGMAS-2] Une erreur interne est survenue.");
            });
        }} style={{
            opacity: hintEnabled ? "1" : "0"
        }}>Demander un indice</button>
        
        <Nav></Nav>
    </div>;
}