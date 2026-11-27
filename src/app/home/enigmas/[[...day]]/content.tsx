"use client"

import "../../../globals.css"
import "./style.css"

import { PostOutputSchema, PostSchema } from "@/app/api/solve/model";
import { CURRENT_DAY, type Faction } from "@/db/data";
import { Nav, NAV_HEIGHT } from "../../nav";
import TextBox, { BoxType } from "@/components/text-box/text-box";
import { useState } from "react";
import { Post } from "@/app/api/send-message/model";
import IconButton from "@/components/icon-button";

export default function Content({ 
    enigmaContent, enigmaSolved, day, faction 
} : { 
    enigmaContent: string, enigmaSolved: boolean, day: number, faction: Faction 
}) {
    const [text, setText] = useState("");
    const [warn, setWarn] = useState("");
    const [error, setError] = useState("");
    const [cannotHint, disableHint] = useState(false);
    const [cannotSubmit, disableSubmit] = useState(true);
    const [solved, setSolved] = useState(enigmaSolved);

    return <div className="main" style={{padding: "5vh"}}>
        <TextBox content={text} setter={setText} type={BoxType.Info}></TextBox>
        <TextBox content={warn} setter={setWarn} type={BoxType.Warn}></TextBox>
        <TextBox content={error} setter={setError}></TextBox>

        <p><b>JOUR {day}</b></p>

        <p style={{margin: "2vh"}}>"{enigmaContent}"</p>
        
        {solved ? <div>
            <p>Votre faction a résolut l'énigme du jour, félicitations !</p>
        </div> : <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <form className="main" onSubmit={(event) => {
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
                        setSolved(true);
                    }
                });
            }}>
                <p>Votre faction a trouvé la solution ?</p>
                <input 
                    name="solution" style={{margin: "5vh"}} 
                    type="text" required={true} placeholder="proposez une solution" 
                    onChange={(x) => disableSubmit(x.target.value == "")}
                ></input>
                <IconButton text="Soumettre cette solution" icon="send_time_extension" disabled={cannotSubmit} type="submit"></IconButton>
            </form>

            <p style={{margin: "5vh"}}>Votre faction a besoin d'aide ?</p>
            <IconButton text="Demander un indice" disabled={cannotHint} icon="emoji_objects" onclick={() => {
                if (cannotHint) return;
                disableHint(true);

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
            }}></IconButton>
        </div>}

        <div style={{
            position: "fixed",
            width: "90vw",
            bottom: NAV_HEIGHT,
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "3vh"
        }} id="enigma-nav">
            <IconButton 
                text="Énigme précédente" icon="arrow_left_alt" 
                disabled={day <= 1}
                onclick={() => window.location.href = `/home/enigmas/${day - 1}`}
            ></IconButton>
            <IconButton 
                text="Énigme suivante" icon="arrow_right_alt" 
                disabled={day >= CURRENT_DAY}
                textBefore={true} onclick={() => window.location.href = `/home/enigmas/${day + 1}`}
            ></IconButton>
        </div>
        <Nav></Nav>
    </div>;
}