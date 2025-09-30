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

  // This will be the method of getting the entire board that our UI will eventually need to render it.
  const getBoard = () => board;

  const selectCell = (row, column, player) => {
    if(board[row][column].getValue() === '' ) {
      board[row][column].addToken(player);
      return true;
    } else {
       console.log("cell is filled, choose another cell");
       return false;
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

//  A Cell represents one "square" on the board and can have one of
//  0: no token is in the square,
//  1: Player One's token,
//  2: Player 2's token
function Cell() {
  let value = '';

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


//  The GameController IEFE will be responsible for controlling the 
//  flow and state of the game's turns, as well as whether
//  anybody has won the game

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 'x'
    },
    {
      name: playerTwoName,
      token: 'o'
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

    // add tokens if the move is valid then switch player.
    const validMove = board.selectCell(row, column, getActivePlayer().token);
    if (validMove) {
      switchPlayerTurn();
    }
    
    /*  This is where we would check for a winner and handle that logic,
    such as a win message. */

    // get values of the board to do the comparison for win conditions
    const testBoard = board.getBoard();
    win = []
    for(i = 0; i < 3; i++) {
      for(j = 0; j < 3; j++) {
        win.push(testBoard[i][j].getValue())
      }
    }

    // vertical 
    for( let i = 0; i <= 2; i++ ) {
      if (win[0 + i] + win[3 + i] + win[6 + i] === 'ooo') {
        console.log("win OOO!!!");
        ScreenController();
      }
      if (win[0 + i] + win[3 + i] + win[6 + i] === 'xxx') {
        console.log("win XXX!!!");
      }
    }

    // horizontal
    for( let i = 0, j = 0; i <= 2; i++ ) {
      if (win[0 + j] + win[1 + j] + win[2 + j] === 'ooo') {
        console.log("win OOO!!!");
      }
      if (win[0 + j] + win[1 + j] + win[2 + j] === 'xxx') {
        console.log("win XXX!!!");
      }
      j = j + 3;
    }

    // cross
    for (let i = 0, j = 0; i <= 1; i++) {
      if ( win[0 + j] + win[4] + win[8 - j] === 'ooo') {
        console.log("cross win for OOO");
      }
      if ( win[0 + j] + win[4] + win[8 - j] === 'xxx') {
        console.log("cross win for XXX");
      }
      j = 6;
    }

    // tie
    emptyCount = 0;
    for ( let i = 0; i < win.length; i++ ) {
      if( win[i] === '') {
        emptyCount += 1;
      }
    }
    if (emptyCount == 0) {
      console.log("tie")
    }
    //  const availableCells = testBoard.filter((row) => row[column].getValue() === '').map(row => row[column]);
    //  console.log(availableCells.length)


    printNewRound();
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
};

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

    // Render board squares
    let i = 0;
    board.forEach(row => {
      row.forEach((cell, index) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function 
        cellButton.dataset.column = index;
        cellButton.dataset.row = i;
        if(index === 2) {
          i++;
        }

        
        
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    })
  }

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedColumn) return;
    
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();

  // delete html elements and call update screen again when a win or tie condition is met
  

  // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController();