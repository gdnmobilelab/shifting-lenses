
export default function Lens(props) {
    return <div class='lens' style={{background: props.background || "#fff"}}>
       {props.children}
    </div>
}