import Icon from "./icon";

export default function FileInput({ 
    id, accept, required, label 
} : { 
    id: string, accept: string[], required: boolean, label: string 
}) {
    return <>
        <label htmlFor={id} className="input-file-label" style={{display: "flex"}}>
            <Icon name="upload" style={{margin: "0", marginRight: "1vw"}}></Icon>
            {label}
        </label>
        <input id={id} type="file" name={id} accept={accept.join(", ")} required={required}></input>
    </>;
}   