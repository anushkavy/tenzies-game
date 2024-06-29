import "./App.css";
import Die from "./Components/Die";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  // Function to generate first random array
  function allNewDice() {
    const randArr = Array.from({ length: 10 }, () => {
      return {
        value: Math.floor(Math.random() * 6) + 1,
        isHeld: false,
        id: nanoid(),
      };
    });
    console.log(randArr);
    return randArr;
  }

  const [numArr, setNumArr] = useState(allNewDice());
  const [heldNum, setHeldNum] = useState(null);
  const [tenzies, setTenzies] = useState(false); //Variable to determine win
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    JSON.parse(localStorage.getItem("highScore")) || 0
  );
  const [newHighScore, setNewHighScore] = useState(false);

  useEffect(() => {
    const allHeld = numArr.every((die) => die.isHeld);
    if (allHeld) {
      setTenzies(true);
    }
  }, [numArr]);

  useEffect(() => {
    if (tenzies) {
      if (highScore < score && highScore !== 0) {
        console.log("you didn't cross highscore");
      } else {
        setNewHighScore(true);
        localStorage.setItem("highScore", JSON.stringify(score));
      }
    }
  }, [tenzies]);

  function handleClick() {
    if (tenzies) {
      setNumArr(allNewDice());
      setHeldNum(null);
      setTenzies(false);
      setScore(0);
      setHighScore(JSON.parse(localStorage.getItem("highScore")));
      setNewHighScore(false);
    } else {
      setNumArr((prevDice) =>
        prevDice.map((dice) => {
          return dice.isHeld
            ? dice
            : { ...dice, value: Math.floor(Math.random() * 6) + 1 };
        })
      );
      setScore((prevScore) => prevScore + 1);
    }
  }

  function holdDice(diceId) {
    setNumArr((prevDice) =>
      prevDice.map((dice) => {
        //Finding the clicked dice
        if (dice.id === diceId) {
          //checking and setting the value of the first click so it can't be changed later
          if (heldNum == null) {
            setHeldNum(dice.value);
            return { ...dice, isHeld: true };
          } else {
            //checking if further dice values are same as the first click
            if (heldNum === dice.value) {
              return { ...dice, isHeld: true };
            } else {
              return dice;
            }
          }
        }
        return dice;
      })
    );
  }

  return (
    <div className="App">
      <main>
        {tenzies && <Confetti />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        {newHighScore && <h3 className="newHighScore">NEW HIGHSCORE!! 🎉</h3>}
        <div className="allScores">
          <div className="score">Score</div>
          <div className="scoreNum">{score}</div>
          <div className="highScore">High Score</div>
          <div className="highScoreNum">{highScore}</div>
        </div>
        <Die numArr={numArr} holdDice={holdDice} />
        <button className="rollBtn" onClick={handleClick}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </main>
    </div>
  );
}

export default App;
