"use client"

import { Faction, faction_colors, prefers_dark } from "@/db/data"
import { useEffect } from "react";
import { JSX } from "react/jsx-runtime"

export default function StyledBody({ 
    inner, faction
} : { 
    inner: JSX.Element, faction: Faction
}) {
    useEffect(() => {
        const style = faction_colors(faction, prefers_dark());

        for (const [k, v] of Object.entries(style)) {
            document.documentElement.style.setProperty("--" + k, v);
        }
    }, []);

    return <div>
        {inner}
    </div>
} 