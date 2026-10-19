"use client";

import { type Body as PlayerBody } from "./api/players/route"

export default function Home() {
    return <div>
        <button onClick={() => {
            const data: PlayerBody = {
                name: "frisk",
                faction: "Sapiens",
                race: "Assassin"
            };

            fetch("api/players", {
                method: "PUT",
                body: JSON.stringify(data)
            }).then((x) => {
                if (!x.ok || !x.body) return;
                x.json().then((x) => {
                    if (!x) return;

                    console.log(x);
                })
            });
        }}>PUT</button>

        <button onClick={() => {
            fetch("api/players").then((x) => {
                if (x.status !== 200 || !x.body) return;
                x.json().then((x) => {
                    if (!x) return;

                    console.log(x);
                });
            });
        }}>GET</button>
    </div>;
}
