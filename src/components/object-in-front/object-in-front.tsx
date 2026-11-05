import "./style.css"

import { CSSProperties } from "react";
import { JSX } from "react/jsx-runtime";

export default function ObjectInFront({ object, enabled } : { object: JSX.Element, enabled: boolean }) {
    const style: CSSProperties = enabled ? {
        opacity: "1",
        pointerEvents: "auto"
    } : {
        opacity: "0",
        pointerEvents: "none"
    }

    return <div className="object-in-front" style={style}>
        {object}
    </div>
}