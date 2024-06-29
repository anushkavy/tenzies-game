export default function Die(props) {
  const dieElements = props.numArr.map((die) => (
    <div
      className={die.isHeld ? "die dieIsHeld" : "die"}
      key={die.id}
      onClick={() => props.holdDice(die.id)}
    >
      {die.value}
    </div>
  ));
  return <div className="diceGrid">{dieElements}</div>;
}
