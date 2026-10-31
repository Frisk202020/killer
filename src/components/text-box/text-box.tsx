"use client"

import { Dispatch } from "react";
import "./style.css"

export enum BoxType {
    Error,
    Warn,
    Info
}

function colors(type: BoxType) {
    switch(type) {
        case BoxType.Error: return { bg: "#e9a9a9e1", border: "#fc6c6c" };
        case BoxType.Warn: return { bg: "#fece82c8", border: "#ffb743" };
        case BoxType.Info: return { bg: "#bcfff6b6", border: "#8bf1e4" };
    }
}

const TIME = 3000; // ms
let timer: Promise<void>|null = null;

export default function TextBox({ content, setter, type = BoxType.Error }: { content: string, setter: Dispatch<string>, type?: BoxType }) {
    if (timer === null && content !== "") timer = new Promise<void>((r) => setTimeout(r, TIME)).then(() => { setter(""); timer = null; });

    const x = colors(type);
    return <div className="box-container" style={{
        opacity: content === "" ? "0" : "1",
        backgroundColor: x.bg,
        borderColor: x.border
    }}>
        <div className="box">{content}</div>
    </div>
}