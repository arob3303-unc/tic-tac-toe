import React, {useState, useEffect} from "react";
import LoginModal from "./components/LoginModal";
import Leaderboard from "./components/Leaderboard";

// square function -> to create a square
function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

// record the win to the sql database via logged in user
function recordWin(username = "O") {
  fetch("http://localhost:5000/win", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log("Win recorded!");
      }
    })
    .catch(err => console.error(err));
}

// function to find winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// random number generator for "O" to go into a random spot on the board
function oRandom(squares) {
  const emptySquares = squares
    .map((val, idx) => (val === null ? idx : null))
    .filter(v => v !== null);
  if (emptySquares.length === 0) return null;
  const randIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randIndex];
}

// tic tac toe board
function Board({xIsNext, squares, onPlay, user}) {
  const winner = calculateWinner(squares);
  let status;
  let int = 0;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      int += 1;
    }
  }

  if (winner) {
    if (winner === "X") {
      status = "Great job " + user.toUpperCase() + ", you won!";
    } else {
      status = "Unfortunate, the AI beat you!" 
    }
  } else if (int === 9) {
    status = user.toUpperCase() + " is first!";
  } else {
    status = "Good luck!"
  }

  function handleClick(i) {
    // check winner
    if (calculateWinner(squares)) {
      return;
    }

    if (squares[i] != null) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  return (
    <>
      {/* display winner or turn */}
      <div className="status">{status}</div>

      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  const [user, setUser] = useState(null);
  const [winner, setWinner] = useState(null);
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(false)

  // restart function
  function restartGame() {
    setHistory([Array(9).fill(null)]); // clear board
    setXIsNext(true);                  // X starts
    setWinner(null);                   // no winner
    setRefreshLeaderboard(prev => !prev); // refresh leaderboard
  }

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);

    const gameWinner = calculateWinner(nextSquares);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  }

  useEffect(() => {
  if (!xIsNext && !winner) {
    const timer = setTimeout(() => {
    // O's turn
    const move = oRandom(currentSquares);
    if (move !== null) {
      const nextSquares = currentSquares.slice();
      nextSquares[move] = "O";
      handlePlay(nextSquares);
    }
    }, 250);
    return () => clearTimeout(timer);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [xIsNext, winner, currentSquares]);


  useEffect(() => {
    if (winner === "X" && user) {
      recordWin(user);
    } else if (winner === "O" && user) {
      recordWin("AI / Computer")
    }
  }, [winner, user]);

  return (
    <div>
      {/* Add "!" in front of user below to enable log in / create account */}
      {user ? (
        <LoginModal onLogin={setUser} />
      ) : (<>

      {              /* Website front-end layout / text */            }

      <div className="main-content">
        <div className="title">
          <h1>Tic-Tac-Toe</h1>
        <div className="game">
          <div className="restart-container">
            <button onClick={restartGame} className="restart-btn">
              Restart
            </button>
            <button onClick={() => setUser(null)} className="restart-btn">
              Log-Out
            </button>
          </div>
          <div className="game-board">
            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
              user={user} 
            />
          </div>
          <div className="leaderboard-container">
            <Leaderboard refresh={refreshLeaderboard}/>
          </div>
        </div>
       </div>
      </div>



            </>)}
    </div>
  );
}
