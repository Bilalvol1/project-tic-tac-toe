// The Gameboard represents the state of the board
// Each equare holds a Cell
// and we expose a selectCell method to be able to add Cells to squares
function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;

  const selectCell = (row, column, player) => {
  
    // if there is no token in the selected square, then assign a cell to it.
    if( board[row][column].getValue() === 0 ) {
      board[row][column].addToken(player);
      return 1;
    } else {
       console.log("cell is filled, choose another cell");
       return 0;
    }
    
  };
  
  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { getBoard, selectCell, printBoard };
}

/*
** A Cell represents one "square" on the board and can have one of
** 0: no token is in the square,
** 1: Player One's token,
** 2: Player 2's token
*/
function Cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

/* 
** The GameController IEFE will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/
const game = (function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1
    },
    {
      name: playerTwoName,
      token: 2
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    // Add a token to the selected cell
    console.log(
      `adding ${getActivePlayer().name}'s token into row ${row} & column ${column}...`
    );

    // const availableCells = board.getBoard().filter((row) => row[column].getValue() === 0).map(row => row[column]);

    const switchBoolean = board.selectCell(row, column, getActivePlayer().token);

    // const updatedAvailableCells = board.getBoard().filter((row) => row[column].getValue() === 0).map(row => row[column]);

    /*  This is where we would check for a winner and handle that logic,
        such as a win message. */

    // Switch player turn
    if (switchBoolean) {
      switchPlayerTurn();
    }
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer
  };
})();
