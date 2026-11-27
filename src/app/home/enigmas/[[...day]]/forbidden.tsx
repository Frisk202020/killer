"use client"

import IconButton from "@/components/icon-button";
import { Nav } from "../../nav";

export const Forbidden = () => <div className="main">
    <p style={{margin: "5vh"}}>L'énigme du jour n'a pas encore été publiée</p>
    <IconButton text="Retour à l'énigme du jour" icon="undo" onclick={() => window.location.href = "/home/enigmas"}></IconButton>

    <Nav></Nav>
</div> 