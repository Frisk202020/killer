"use client"

import "../../globals.css"
import "./style.css"

import { Post } from "@/app/api/authenticate/model";
import { PostSchema } from "@/app/api/setup-account/model";
import TextBox from "@/components/text-box/text-box";
import Input from "@/components/input/input";
import { useState } from "react";

export default function Content({ name, token } : { name: string, token: string }) {
    const [error, setError] = useState("");
    const [failed, setFailed] = useState(false);

    const tokenName = "token";
    const password = "password";

    if (failed) new Promise(r => setTimeout(r, 3000)).then(() => window.location.href = "/login");
    

    return failed ? <div className="main" id="main-welcome">
        <p>Nous n'avons pas réussi à vous authentifier. Vous allez être redirigé vers la page de connexion...</p>
    </div> : <div className="main" id="main-welcome">
        <p>Bienvenue, {name} !</p>
        <p>Pour finaliser votre inscription, veuillez renseigner votre mot de passe.</p>
        <TextBox content={error} setter={setError}></TextBox>

        <form style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }} onSubmit={(event) => {
            event.preventDefault();

            const data = new FormData(event.currentTarget);
            const content = {
                token: data.get(tokenName),
                pwd: data.get(password)
            };

            const parsed = PostSchema.safeParse(content);
            if (!parsed || parsed.data === undefined) {
                setError("Informations invalides");
                return;
            }

            fetch("/api/setup-account", { method: "POST", body: JSON.stringify(parsed.data) }).then((res) => {
                if (!res.ok) {
                    setError("L'invitation n'est plus valide");
                    return;
                }

                const body: Post = { name, pwd: parsed.data.pwd };
                fetch("/api/authenticate", { method: "POST", body: JSON.stringify(body) }).then((res) => {
                    if (!res.ok) {
                        setFailed(true); 
                        return;
                    }

                    window.location.href = "/";
                });
            });
        }}>
            <input type="hidden" name="token" value={token}></input>
            <Input label="Mot de passe" name={password} required={true} options={{type: "password"}}></Input>
            <button type="submit" style={{marginTop: "5vh"}}>Envoyer</button>
        </form>
    </div>;
}