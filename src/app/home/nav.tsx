import Icon from "@/components/icon";
import { IconName } from "@/db/data";

const nav: [IconName, string][] = [
    ["star_shine", ""],
    ["groups", "/home/players"],
    ["home", "/home"],
    ["extension", "/home/enigmas"],
    ["swords", "/home/arena"]
] as const;

export const Nav = () => <div style={{
    display: "flex",
    position: "fixed",
    bottom: "0px",
}}>
    {nav.map(([ico, link], i) => <button key={`nav.${i}`} style={{
        width: "20vw",
        height: "20vw",
        border: "solid .5vw",
        borderRadius: "0"
    }} onClick={() => window.location.href = link}><Icon name={ico} style={{fontSize: "12vw"}}></Icon></button>)}
</div>