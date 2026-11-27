import { IconName } from "@/db/data";
import Icon from "./icon";

type ButtonType = "submit" | "reset" | "button"; 

export default function IconButton({ 
    text, icon, type, disabled, onclick, textBefore
} : { 
    text: string, icon: IconName, type?: ButtonType, disabled?: boolean, onclick?: () => void, textBefore?: boolean
}) {
    disabled ??= false;
    textBefore ??= false;

    return textBefore ? <button style={{display: "flex", alignItems: "center"}} type={type} disabled={disabled} onClick={onclick}>
        {text}
        <Icon name={icon}></Icon>
    </button> : <button style={{display: "flex", alignItems: "center"}} type={type} disabled={disabled} onClick={onclick}>
        <Icon name={icon}></Icon>
        {text}
    </button>
}