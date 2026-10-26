"use client";

import { BuildGetParams } from "./api/model-helper";
import { type Put as PutPlayer, type Post as PostPlayer, type Get as GetPlayer, type Delete as DeletePlayer, GetSchema as GetPlayersSchema } from "./api/players/model"
import { type Get as GetTarget, type Put as PutTarget, type Delete as DeleteTarget, GetSchema as GetTargetsSchema } from "./api/targets/model"
import { type Get as GetEnigma, type Post as PostEnigma, type Delete as DeleteEnigma, GetSchema as GetEnigmasSchema } from "./api/enigmas/model"
import type { Post as PostKill } from "./api/kill/model"
import type { Post as PostArena } from "./api/arena/model"
import type { Post as PostSetup } from "./api/setup-account/model"
import type { Post as PostAuth } from "./api/authenticate/model"
import type { Post as PostBot } from "./api/send-message/model"

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
            const body: GetPlayer = { };
            fetch(`api/players?${BuildGetParams(GetPlayersSchema, body)}`).then(handle);
        }}>GET</button>

        <button onClick={() => {
            const data: PutPlayer = {
                name: "hadrien",
                faction: "Sapiens",
                race: "Assassin",
                discord_id: "ha2824"
            };

            fetch("api/players", {
                method: "PUT",
                body: JSON.stringify(data)
            }).then(handle);
        }}>PUT</button>

        <button onClick={() => {
            const body: PostPlayer = { 
                name: "hugo", 
                data: { gold: 100, alive: false, faction: "Aazimaar", faction_score: 100, self_score: 100, race: "Bombardier" } 
            };

            fetch("api/players", {
                body: JSON.stringify(body),
                method: "POST"
            }).then(handle);
        }}>POST</button>

        <button onClick={() => {
            const body: DeletePlayer = { name: "hadrien" };

            fetch("api/players", {
                body: JSON.stringify(body),
                method: "DELETE"
            }).then(handle);
        }}>DELETE</button>

        <br></br>
        <h3>Setup Account</h3>

        <button onClick={() => {
            const body: PostSetup = { token: "56c82dd05254829366b3ac9a2f93f43deacc245244d5d16a671b5185a0937b40", pwd: "perdu" };
            fetch("api/setup-account", { method: "POST", body: JSON.stringify(body) }).then(handle);
        }}>POST</button>

        <br></br>
        <h3>Auth</h3>

        <button onClick={() => {
            const body: PostAuth = { name: "Frisk", pwd: "P&rdu:(0" };
            fetch("api/authenticate", { method: "POST", body: JSON.stringify(body) }).then(handle);
        }}>POST</button>

        <br></br>
        <h3>Targets</h3>

        <button onClick={() => {
            const body: GetTarget = { faction: "Sapiens" };
            fetch(`api/targets?${BuildGetParams(GetTargetsSchema, body)}`).then(handle);
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
            const body: PostKill = { query_faction: "Sapiens", killer: "hugo", killed: "jenny" };
            fetch("api/kill", {
                method: "POST",
                body: JSON.stringify(body)
            }).then(handle)
        }}>POST</button>

        <br></br>
        <h3>Enigmas</h3>

        <button onClick={() => {
            const body: GetEnigma = { id: 1 };
            fetch(`api/enigmas?${BuildGetParams(GetEnigmasSchema, body)}`).then(handle)
        }}>GET</button>
        <button onClick={() => {
            const body: PostEnigma = { id: 1, content: "Hello world" };
            fetch("api/enigmas", { method: "POST", body: JSON.stringify(body) }).then(handle);
        }}>POST</button>
        <button onClick={() => {
            const body: DeleteEnigma = { id: 1 };
            fetch("api/enigmas", { method: "DELETE", body: JSON.stringify(body) }).then(handle);
        }}>DELETE</button>

        <br></br>
        <h3>Reset Players</h3>

        <button onClick={() => fetch(`api/reset-players`, { method: "POST" }).then(handle)}>POST</button>

        <br></br>
        <h3>Arena</h3>

        <button onClick={() => {
            const body: PostArena = { winner: "hugo", looser: "loris" };
            fetch("api/arena", { method: "POST", body: JSON.stringify(body) }).then(handle) 
        }}>POST</button>

        <br></br>
        <h3>Bot</h3>

        <button onClick={() => {
            const body: PostBot = { message: "hello world" };
            fetch("api/send-message", { method: "POST", body: JSON.stringify(body) }).then(handle);
        }}>POST</button>
    </div>;
}
