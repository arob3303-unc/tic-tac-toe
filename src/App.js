import { useState } from "react";
 
// square function -> to create a square
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  // onClick uses the function above ^
  return <button className="square" onClick={handleClick}>{value}</button>;
}

// tic tac toe board
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
