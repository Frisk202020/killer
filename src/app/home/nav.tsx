export const Nav = () => <div style={{
    display: "flex",
    position: "fixed",
    bottom: ".5vw"
}}>
    {([
        "skills",
        "people",
        "home",
        "enigma",
        "arena"
    ] as const).map((img, i) => <button key={`nav.${i}`} style={{
        width: "20vw",
        height: "20vw",
        border: "solid .5vw"
    }}><img src={`nav/${img}.png`} style={{
        width: "100%",
    }}></img></button>)}
</div>