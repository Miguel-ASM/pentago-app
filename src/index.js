import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/* Square Component: defined as a function component*/
function Square(props) {

  /*
    Return a button element with 2 clasNames: "square" and then
    "square-isLooser" if props.isWinner = false or "square-isWinner"
    if props.isWinner = true.
  */

  /*Props coming from the Board component : value, onClick, isWinner*/

  const clasNames = ["square",(props.isWinner)? "square-isWinner" : "square-isLooser" ].join(" ");

  /*
  const styleLooser = {};
  const styleWinner = {background : "white"}
  */
  return (
    <button className={clasNames}
            onClick = {props.onClick}
    >
      {props.value}
    </button>
  );
}

//

class Board extends React.Component {

  /*Receives from Game the props: onClick, squares*/

  /*Function that checks if square[i] is in the winner line*/
  squareIsWinner(n){
    const lines = [
      [0,1,2,3,4],
      [1,2,3,4,5],
      [6,7,8,9,10],
      [7,8,9,10,11],
      [12,13,14,15,16],
      [13,14,15,16,17],
      [18,19,20,21,22],
      [19,20,21,22,23],
      [24,25,26,27,28],
      [25,26,27,28,29],
      [30,31,32,33,34],
      [31,32,33,34,35],
      [0,6,12,18,24],
      [6,12,18,24,30],
      [1,7,13,19,25],
      [7,13,19,25,31],
      [2,8,14,20,26],
      [8,14,20,26,32],
      [3,9,15,21,27],
      [9,15,21,27,33],
      [4,10,16,22,28],
      [10,16,22,28,34],
      [5,11,17,23,29],
      [11,17,23,29,35],
      [1,8,15,22,29],
      [0,7,14,21,28],
      [7,14,21,28,35],
      [6,13,20,27,34],
      [4,9,14,19,24],
      [5,10,15,20,25],
      [10,15,20,25,30],
      [11,16,21,26,31]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d, e] = lines[i];
      if (this.props.squares[a] && this.props.squares[a] === this.props.squares[b] && this.props.squares[a] === this.props.squares[c] && this.props.squares[a] === this.props.squares[d] && this.props.squares[a] === this.props.squares[e]) {
        return [a,b,c,d,e].includes(n);
      }
    }
    return false;
  }

  /*Render the squares*/
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinner = {this.squareIsWinner(i)}
      />
    );
  }



  /* Function to create the SubTable*/
  createSubTable(n,m) {
    /*n,m are the subtable indexes*/
    let subTable = []
    let num;

    // Outer loop to create each line
    for (let i = 0; i < 3; i++) {
      let subRow = []
      //Inner loop to create children
      for (let j = 0; j < 3; j++) {
        num = 6*(3*n+i) + 3*m + j;
        subRow.push(<td>{this.renderSquare(num)}</td>)
      }
      //Create the parent and add the children
      subTable.push(<tr className="subtable-row">{subRow}</tr>)
    }
    return (<table className = "subTable">{subTable}</table>)
  }

  createTable(){
    let board = []

    // Outer loop to create each line
    for (let n = 0; n < 2; n++) {
      let row = []
      //Inner loop to create children
      for (let m = 0; m < 2; m++) {
        row.push(<td>{this.createSubTable(n,m)}</td>)
      }
      //Create the parent and add the children
      board.push(<tr className="board-row">{row}</tr>)
    }
    return board
  }

  render() {
    return(
      <table className="Table">
        {this.createTable()}
      </table>
    )
  }

}



class Game extends React.Component {

  /*Constructor of the class*/
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      rotationIsActive: false
    };
    /*Bind functions*/
    this.handleClick = this.handleClick.bind(this);
    this.resetGame = this.resetGame.bind(this)
  }

  /*HANDLELERS*/

  /*Add a method to reset the game*/
  resetGame() {
    this.setState({
      squares: Array(9).fill(null),
      xIsNext: true,
      rotationIsActive: false
    });
  }
  /*handle a click on a square*/
  handleClick(i) {
    const squares = this.state.squares.slice();

    /*Change the state of the squares*/
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      xIsNext: !(this.state.xIsNext)
    });
  }

  /*sub-board index to board index*/
  subToBoard(row,col,p){
    /*
      row = row index of the sub-board
      col = col index of the sub-board
      p = linear index (row-wise) of the sub-board square

      this function returns the linear (row-wise) index of a square position in a sub-board,
      given the row and column of that sub-board
    */
    return 6*(row+3*Math.floor(p/3)) + 3*(p%3) + col
  }

  left(p) {
    /*
      rotations to the left of the squares in a sub-board.
      p is the linear (row-wise) index of the "p" to be rotated.
    */
    const arr = [1,2,5,0,4,8,3,6,7]
    return arr[p]
  }

  right(p) {
    /*
      rotations to the right of the squares in a sub-board.
      p is the linear (row-wise) index of the "p" to be rotated.
    */
    const arr = [3,0,1,6,4,2,7,8,5]
    return arr[p]
  }


  rotateLeft(row,col) {
    /*
      rotation to the left of all the squares in the sub-board at
      (row,col) in the complete board.
    */

    const squares = [];
    const indexes = [];
    let p = 0;

    for(let i = 0;i<9;i++){
      indexes.push(this.subToBoard(row,col,i));
    }

    for(let n = 0;n<36;n++){
      if (indexes.includes(n)){
        squares.push(this.squares[this.subToBoard(row,col,this.left(p))]);
        p++;
      } else {
        squares.push(this.squares[n]);
      }
      this.setState({squares: squares})
    }
  }

  rotateRight(row,col) {
    /*
      rotation to the left of all the squares in the sub-board at
      (row,col) in the complete board.
    */
    const squares = [];
    const indexes = [];
    let p = 0;

    for(let i = 0;i<9;i++){
      indexes.push(this.subToBoard(row,col,i));
    }

    for(let n = 0;n<36;n++){
      if (indexes.includes(n)){
        squares.push(this.squares[this.subToBoard(row,col,this.right(p))]);
        p++;
      } else {
        squares.push(this.squares[n]);
      }
      this.setState({squares: squares})
    }
  }






  /*RENDER*/

  render() {
    const squares = this.state.squares.slice();
    const winner = calculateWinner(squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (!squares.includes(null)) {
      status = "It's a tie!!!"
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div>
          <div className="game-board">
            <Board
              squares={squares}
              onClick={this.handleClick}
            />
            <div className="reset-button">
              <button onClick = {this.resetGame}>
                  Reset
              </button>
            </div>
          </div>
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
      </div>
    );
  }

}


/*Render the game class*/



ReactDOM.render(
  <Game />, document.getElementById("root")
  );

/*Auxiliar function that calculates the winner*/
function calculateWinner(squares) {
  const lines = [
    [0,1,2,3,4],
    [1,2,3,4,5],
    [6,7,8,9,10],
    [7,8,9,10,11],
    [12,13,14,15,16],
    [13,14,15,16,17],
    [18,19,20,21,22],
    [19,20,21,22,23],
    [24,25,26,27,28],
    [25,26,27,28,29],
    [30,31,32,33,34],
    [31,32,33,34,35],
    [0,6,12,18,24],
    [6,12,18,24,30],
    [1,7,13,19,25],
    [7,13,19,25,31],
    [2,8,14,20,26],
    [8,14,20,26,32],
    [3,9,15,21,27],
    [9,15,21,27,33],
    [4,10,16,22,28],
    [10,16,22,28,34],
    [5,11,17,23,29],
    [11,17,23,29,35],
    [1,8,15,22,29],
    [0,7,14,21,28],
    [7,14,21,28,35],
    [6,13,20,27,34],
    [4,9,14,19,24],
    [5,10,15,20,25],
    [10,15,20,25,30],
    [11,16,21,26,31]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}
