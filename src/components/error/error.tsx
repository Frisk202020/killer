"use client"

import "./style.css"

export default function ErrorBox({ content }: { content: string }) {
    return <div className="error-container" style={{opacity: content === "" ? "0" : "1"}}>
        <div className="error-box">{content}</div>
    </div>
}