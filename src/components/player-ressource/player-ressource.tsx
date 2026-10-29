import "./style.css"

export function PlayerRessource({ ressource, amount, imageVwSize } : {
    ressource: "coin" | "s_score" | "f_score" | "token" | "a_score",
    amount: number,
    imageVwSize: number
}) {
    return <div className="ressource">
        <img src={`player-ressources/${ressource}.png`} style={{width: `${imageVwSize}vw`}}></img>
        <p>{amount}</p>
    </div>
}