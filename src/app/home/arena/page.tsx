import { VoidBase } from "../base";
import Content from "./content";

export const instant = false;

const Arena = () => VoidBase(async (player) => <Content 
    name={player.name} 
    arena_tokens={player.arena_tokens} 
    arena_victories={player.arena_victories}
></Content>);
export default Arena;