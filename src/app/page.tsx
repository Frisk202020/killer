"use client";

import { type PutBody, type PostBody, buildGetBody, DeleteBody } from "./api/players/model"

export default function Home() {
    return <div>
        <button onClick={() => {
            const data: PutBody = {
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
            fetch(`api/players?`).then((x) => {
                if (x.status !== 200 || !x.body) return;
                x.json().then((x) => {
                    if (!x) return;

                    console.log(x);
                });
            });
        }}>GET</button>

        <button onClick={() => {
            const body: PostBody = { name: "frisk", data: { gold: 100, alive: false, faction: "Aazimaar", faction_score: 100, self_score: 100, race: "Bombardier" } };

            fetch("api/players", {
                body: JSON.stringify(body),
                method: "POST"
            }).then((x) => {
                if (x.status !== 200 || !x.body) return;
                x.json().then((x) => {
                    if (!x) return;

                    console.log(x);
                });
            });
        }}>POST</button>

        <button onClick={() => {
            const body: DeleteBody = { name: "frisk" };

            fetch("api/players", {
                body: JSON.stringify(body),
                method: "DELETE"
            }).then((x) => {
                if (x.status !== 200 || !x.body) return;
                x.json().then((x) => {
                    if (!x) return;

                    console.log(x);
                });
            });
        }}>DELETE</button>
    </div>;
}
