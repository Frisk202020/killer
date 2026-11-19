import { Base } from "../base";
import Content from "./content";

export const instant = false;

const Arena = () => Base(async (player) => <Content 
    name={player.name} 
    arena_tokens={player.arena_tokens} 
    arena_victories={player.arena_victories}
></Content>, null);
export default Arena;