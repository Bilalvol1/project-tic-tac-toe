function Cell() {

  let value = '';

  const addPlayerToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addPlayerToken,
    getValue,
  };
}

function Gameboard() {

  const rows = 3;
  const columns = 3;
  const board = [];

  // creates a board that inserts adds tree arrays and add three elements 
  // to each array
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // used for UI for rendering and not being able to change the board array 
  // by making a private variable
  const getBoard = () => board;

  // adds token to the board by first checking if the cell is empty
  const addToken = (row, column, player) => {
    if(board[row][column].getValue() === '' ) {
      board[row][column].addPlayerToken(player);
      return true;
    } else {
       console.log("Invalid Move");
       return false;
    }
  };

  // prints board in the console, to be removed after UI is done
  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);
  };

  return { 
    getBoard, 
    addToken, 
    printBoard };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {

  // creates a board for the current game and give getBoard, addToken and 
  // printBoard(to be removed when UI is done) methods
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

  // to be removed when UI is done
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  
  const playRound = (row, column) => {

    // add tokens if the move is valid then switch player.
    const validMove = board.addToken(row, column, getActivePlayer().token);
    
    
    /*  This is where we would check for a winner and handle that logic,
    such as a win message. */

    // get values of the board to do the comparison for win conditions
    const winDialog = document.querySelector('#winDialog');
    const announceWinner = document.querySelector('#announceWinner');
    const restartBtn = document.querySelector('#restartBtn');

    restartBtn.addEventListener("click", () => {
    location.reload();
    });


    const testBoard = board.getBoard();
    win = []
    for(i = 0; i < 3; i++) {
      for(j = 0; j < 3; j++) {
        win.push(testBoard[i][j].getValue())
      }
    }

        // tie
    emptyCount = 0;
    for ( let i = 0; i < win.length; i++ ) {
      if( win[i] === '') {
        emptyCount += 1;
      }
    }
    if (emptyCount == 0) {
      console.log("tie");
      announceWinner.textContent = `Tie`
      winDialog.showModal();
    }

    // vertical 
    for( let i = 0; i <= 2; i++ ) {
      if (win[0 + i] + win[3 + i] + win[6 + i] === 'ooo') {
        console.log("win OOO!!!");
        announceWinner.textContent = `${getActivePlayer().name} wins`
        winDialog.showModal();
      }
      if (win[0 + i] + win[3 + i] + win[6 + i] === 'xxx') {
        console.log("win XXX!!!");
        announceWinner.textContent = `${getActivePlayer().name} wins`
        winDialog.showModal();
      }
    }

    // horizontal
    for( let i = 0, j = 0; i <= 2; i++ ) {
      if (win[0 + j] + win[1 + j] + win[2 + j] === 'ooo') {
        console.log("win OOO!!!");
        announceWinner.textContent = `${getActivePlayer().name} wins`
        winDialog.showModal();
      }
      if (win[0 + j] + win[1 + j] + win[2 + j] === 'xxx') {
        console.log("win XXX!!!");
        announceWinner.textContent = `${getActivePlayer().name} wins`
        winDialog.showModal();
      }
      j = j + 3;
    }

    // cross
    for (let i = 0, j = 0; i <= 1; i++) {
      if ( win[0 + j] + win[4] + win[8 - j] === 'ooo') {
        console.log("cross win for OOO");
        announceWinner.textContent = `${getActivePlayer().name} wins`
        winDialog.showModal();
      }
      if ( win[0 + j] + win[4] + win[8 - j] === 'xxx') {
        console.log("cross win for XXX");
        announceWinner.textContent = `${getActivePlayer().name} wins`
        winDialog.showModal();
      }
      j = 6;
    }



    if (validMove) {
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
    getActivePlayer,
    getBoard: board.getBoard,
  };
};

function ScreenController() {

  let game;
  if(playerOne.value === '' || playerTwo === '') {
    game = GameController()
  } else {
    game = GameController(playerOne.value, playerTwo.value);
  }

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
        // Create a data attribute to identify the column and row
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

const initGame = (function() {
  const playerOne = document.querySelector('#playerOne');
  const playerTwo = document.querySelector('#playerTwo');
  const initialization = document.querySelector('#submitBtn');
  const showBtn = document.querySelector('#showBtn')
  const dialog = document.querySelector('dialog')

  showBtn.addEventListener("click", () => {
    dialog.showModal();
});
  
  ScreenController();
  
  initialization.addEventListener("click", () => {
    ScreenController();
    dialog.close();
  })
})()