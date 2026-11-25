import type { IconName } from "@/db/data";
import { CSSProperties } from "react";

export default function Icon({ name, style, action, className } : { name: IconName, style?: CSSProperties, action?: ()=>void, className?: string }) {
    className += " material-symbols-outlined";
    if (action !== undefined) className += " clickable";

    return <span className={className} style={style} onClick={action}>{name}</span>
}