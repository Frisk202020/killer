import "./style.css"
import { CSSProperties } from "react";

interface Options {
    type?: string,
    style?: CSSProperties
}

export default function Input({ label, name, required, options }: {
    label: string,
    name: string,
    required: boolean,
    options?: Options
}) {
    return <div className="input-container">
        <label>{label}</label>
        <input 
            name={name} 
            type={options?.type ?? ""} 
            required={required}
            style={options?.style ?? {}}
        ></input>
    </div>;
}