
import Button from "./Buton";

function Card(props) {
    return (
        <div className = "card">
            <h1> {props.cardName} </h1>
            <p>  {props.description} ...</p>
            <button className="btn"> Button </button>
        </div>
    );
}

export default Card;