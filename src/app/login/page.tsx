"use client"

import "./style.css"
import { useState } from "react";
import { Post, PostSchema } from "../api/authenticate/model";
import ErrorBox from "../../components/error/error";
import Input from "@/components/input/input";

export default function Login() {
    const username = "username";
    const password = "password";
    const [error, setError] = useState("");

    return <div id="main">
        <p style={{marginBottom: "10vh"}}>Connexion</p>
        <ErrorBox content={error}></ErrorBox>

        <form onSubmit={(event) => {
            event.preventDefault();

            const data = new FormData(event.currentTarget);
            const body = {
                name: data.get(username),
                pwd: data.get(password)
            };

            const parsed = PostSchema.safeParse(body);
            if (!parsed.success) {
                setError("Informations d'authentification invalides");
                return;
            }
            
            fetch("api/authenticate", { method: "POST", body: JSON.stringify(parsed.data) }).then(async (res) => {
                if (!res.ok) {
                    setError("Le nom d'utilisateur ou le mot de passe est invalide");
                    return;
                }

                window.location.href = "/";
            });
        }} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Input label="Nom d'utilisateur" name="username" required={true} options={{style: {marginBottom: "5vh"}}}></Input>
            <Input label="Mot de passe" name="password" required={true} options={{type: "password", style: { marginBottom: "10vh" }}}></Input>

            <button type="submit">Se connecter</button>
        </form>
    </div>;
}