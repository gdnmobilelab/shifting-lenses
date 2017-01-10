export default function(props) {

    let proportion = String(props.proportion * 100) + "%";

    return <div class='proportional' style={{'padding-top': proportion}}>
        {props.children}
    </div>
}