"use client"

import { Faction } from "@/db/data"
import { useEffect } from "react";
import { JSX } from "react/jsx-runtime"

interface RootProperties {
    "background-primary": string,
    "background-secondary": string,
    "background-objects": string,
    color: string
}

function root_style(faction: Faction, dark: boolean): RootProperties {
    switch(faction) {
        case "Sapiens":
            return dark ? {
                "background-primary": "#054602",
                "background-secondary": "#011402",
                "background-objects": "#265d26",
                color: "#96f59c"
            } : {
                "background-primary": "#82f07c",
                "background-secondary": "#bcffbf",
                "background-objects": "#81c649",
                color: "#1e5b22"
            };

        case "Aazimaar":
            return dark ? {
                "background-primary": "#030838",
                "background-secondary": "#080480",
                "background-objects": "#6439fe",
                color: "#71d7e7"
            } : {
                "background-primary": "#3cf7f7",
                "background-secondary": "#96ffff",
                "background-objects": "#85fffb",
                color: "#01045a"
            };

        case "Tiefflins":
            return dark ? {
                "background-primary": "#570b03",
                "background-secondary": "#2b0100",
                "background-objects": "#822121",
                color: "#f0857f"
            } : {
                "background-primary": "#de210c",
                "background-secondary": "#ed9229",
                "background-objects": "#ebb25d",
                color: "#501104"
            };
    }
}

export default function StyledBody({ 
    inner, faction
} : { 
    inner: JSX.Element, faction: Faction
}) {
    useEffect(() => {
        const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        const style = root_style(faction, darkMode.matches);

        for (const [k, v] of Object.entries(style)) {
            document.documentElement.style.setProperty("--" + k, v);
        }
    }, []);

    return <div>
        {inner}
    </div>
} 