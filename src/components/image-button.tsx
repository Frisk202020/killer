import { CSSProperties } from "react";

const ImageButton = ({ src, onclick, style={} } : { src: string, onclick: ()=>void, style?: CSSProperties }) => <img 
    src={src} 
    style={style}
    onClick={onclick}
></img>

export default ImageButton;