import clsx from "clsx"
export default function Language(props){
    const styles = { 
        backgroundColor : props.backgroundColor,
        color: props.color
    }
    return (
        <div className={clsx("language-box",{'strike-off':props.isStruckOff})} style={styles}>
            <p>{props.name}</p>
        </div>
    )
}