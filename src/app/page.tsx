"use client";

import { type PutBody, type PostBody, buildGetBody, DeleteBody } from "./api/players/model"
import { buildGetBody as getTargets, type PutBody as PutTarget, type DeleteBody as DeleteTarget } from "./api/targets/model"
import { type PostBody as PostKill } from "./api/kill/model"
import { buildGetBody as getEnigmas, type PostBody as PostEnigmas, type DeleteBody as DeleteEnigmas } from "./api/enigmas/model"

const handle = (x: Response) => {
    if (x.status !== 200 || !x.body) return;
    x.json().then((x) => {
        if (!x) return;

        console.log(x);
    });
}

export default function Home() {
    return <div>
        <h3>Players</h3>

        <button onClick={() => {
            const data: PutBody = {
                name: "vera",
                faction: "Tiefflins",
                race: "Assassin"
            };

            fetch("api/players", {
                method: "PUT",
                body: JSON.stringify(data)
            }).then(handle);
        }}>PUT</button>

        <button onClick={() => {
            fetch(`api/players?`).then(handle);
        }}>GET</button>

        <button onClick={() => {
            const body: PostBody = { name: "frisk", data: { gold: 100, alive: false, faction: "Aazimaar", faction_score: 100, self_score: 100, race: "Bombardier" } };

            fetch("api/players", {
                body: JSON.stringify(body),
                method: "POST"
            }).then(handle);
        }}>POST</button>

        <button onClick={() => {
            const body: DeleteBody = { name: "frisk" };

            fetch("api/players", {
                body: JSON.stringify(body),
                method: "DELETE"
            }).then(handle);
        }}>DELETE</button>

        <br></br>
        <h3>Targets</h3>

        <button onClick={() => {
            fetch(`api/targets?${getTargets("Sapiens")}`).then(handle);
        }}>GET</button>

        <button onClick={() => {
            const body: PutTarget = {faction: "Sapiens", target: "jenny"};
            fetch("api/targets", {method: "PUT", body: JSON.stringify(body)}).then(handle);
        }}>PUT</button>

        <button onClick={() => {
            const body: DeleteTarget = {faction: "Sapiens", target: "jenny"};
            fetch("api/targets", {method: "DELETE", body: JSON.stringify(body)}).then(handle);
        }}>DELETE</button>
            
        <br></br>
        <h3>Reset targets</h3>

        <button onClick={() => {
            fetch("api/reset-targets", {method: "POST"}).then(handle);
        }}>POST</button>

        <br></br>
        <h3>Kill</h3>

        <button onClick={() => {
            const body: PostKill = { query_faction: "Sapiens", killer: "frisk", killed: "jenny" };
            fetch("api/kill", {
                method: "POST",
                body: JSON.stringify(body)
            }).then(handle)
        }}>POST</button>

        <br></br>
        <h3>Enigmas</h3>

        <button onClick={() => fetch(`api/enigmas?${getEnigmas(1)}`).then(handle)}>GET</button>
        <button onClick={() => {
            const body: PostEnigmas = { id: 1, content: "Hello world" };
            fetch("api/enigmas", { method: "POST", body: JSON.stringify(body) }).then(handle);
        }}>POST</button>
        <button onClick={() => {
            const body: DeleteEnigmas = { id: 1 };
            fetch("api/enigmas", { method: "DELETE", body: JSON.stringify(body) }).then(handle);
        }}>DELETE</button>
    </div>;
}
