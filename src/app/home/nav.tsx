export const Nav = () => <div style={{
    display: "flex",
    position: "fixed",
    bottom: "0px"
}}>
    {([
        ["skills", ""],
        ["people", ""],
        ["home", ""],
        ["enigma", "home/enigmas"],
        ["arena", ""]
    ] as const).map(([img, link], i) => <button key={`nav.${i}`} style={{
        width: "20vw",
        height: "20vw",
        border: "solid .5vw"
    }} onClick={() => window.location.href = link}><img src={`/nav/${img}.png`} style={{
        width: "100%",
    }}></img></button>)}
</div>