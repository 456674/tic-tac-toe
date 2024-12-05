import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick }) {
  return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardSize = 15;
  const boardRows = Array(boardSize).fill(null).map((_, row) => (
      <div key={row} className="board-row">
        {Array(boardSize).fill(null).map((_, col) => {
          const index = row * boardSize + col;
          return (
              <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index)}
              />
          );
        })}
      </div>
  ));

  return (
      <>
        <div className="status">{status}</div>
        {boardRows}
      </>
  );
}

export default function Game() {
  const boardSize = 15;
  const [history, setHistory] = useState([Array(boardSize * boardSize).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
    );
  });

  return (
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
  );
}

function calculateWinner(squares) {
  const lines = [];
  const boardSize = 15;

  // 横向、纵向、对角线和反对角线检测
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j <= boardSize - 5; j++) {
      // 横向
      lines.push([i * boardSize + j, i * boardSize + j + 1, i * boardSize + j + 2, i * boardSize + j + 3, i * boardSize + j + 4]);
      // 纵向
      lines.push([j * boardSize + i, (j + 1) * boardSize + i, (j + 2) * boardSize + i, (j + 3) * boardSize + i, (j + 4) * boardSize + i]);
    }
  }

  for (let i = 0; i <= boardSize - 5; i++) {
    for (let j = 0; j <= boardSize - 5; j++) {
      // 对角线
      lines.push([i * boardSize + j, (i + 1) * boardSize + j + 1, (i + 2) * boardSize + j + 2, (i + 3) * boardSize + j + 3, (i + 4) * boardSize + j + 4]);
      // 反对角线
      lines.push([i * boardSize + j + 4, (i + 1) * boardSize + j + 3, (i + 2) * boardSize + j + 2, (i + 3) * boardSize + j + 1, (i + 4) * boardSize + j]);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}
