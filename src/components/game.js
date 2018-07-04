import React from 'react';
import { Board } from './board';

export class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  getNextPlayer = () => this.state.xIsNext ? 'X' : 'O';

  reset = () => {
    const squares = Array(9).fill(null);
    this.setState({
      history: [{
        squares: squares,
      }],
      xIsNext: true
    });
  }

  undo = () => {
    if (this.state.history.length <= 1) {
      return;
    }

    var history = this.state.history.slice(0, this.state.history.length - 1);
    this.setState({
      history: history,
      xIsNext: !this.state.xIsNext
    });
  }

  handleClick = (i) => {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.getNextPlayer();
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const status = winner
      ? 'Winner is ' + winner
      : outOfMoves(current.squares)
        ? 'Draw'
        : 'Next player: ' + this.getNextPlayer();

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
          <div className="game-actions">
            <button className="game-action board-undo"
              onClick={this.undo}
            >
              Undo
        </button>
            <button className="game-action board-reset"
              onClick={this.reset}
            >
              Reset
        </button>
          </div>
        </div>
      </div>
    );
  }
}

function outOfMoves(squares) {
  return squares && squares.indexOf(null) < 0;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}