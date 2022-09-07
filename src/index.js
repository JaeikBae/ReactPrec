import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick = {props.onClick}
        >
            {props.value}
        </button>
    );
}

function calWinner(squares) {
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
            return squares[a]
        }
    }
    return null;
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        const boxbox = []
        for (let i = 0; i < 3; i++) {
            const box = [];
            for (let j = 0; j < 3; j++){
                box.push(this.renderSquare(i*3 + j));
            }
            boxbox.push(
                <div className="board-row" key={i}>
                {box}
                </div>
            );
        }

        return (
            <div>
                {boxbox}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastIdx: -1,
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const lastIdx = i;
        if (calWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastIdx: lastIdx,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calWinner(current.squares);

        const moves = history.map(
            (step, move) => {
                const x = Math.floor(step.lastIdx / 3);
                const y = step.lastIdx % 3;
                const desc  =
                    move ? 'Go to move #' + move + " ( " + x + ", " + y + " )" : 'Go to game start';
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                        </button>
                    </li>
                )
            }
        )

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        }
        else if(!current.squares.includes(null)) {
            status = 'draw';
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
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
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
