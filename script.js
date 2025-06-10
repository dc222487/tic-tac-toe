const Gameboard = (() => {
  const board = Array(9).fill('');

  const getBoard = () => [...board]; // return copy to avoid mutation
  const setMark = (index, mark) => {
    if (board[index] === '') board[index] = mark;
  };
  const resetBoard = () => board.fill('');

  return { getBoard, setMark, resetBoard };
})();


const Player = (name, mark) => {
  return { name, mark };
};


const GameController = (() => {
  let player1;
  let player2;
  let currentPlayer;
  let isGameOver = false;
  let scores = { X: 0, O: 0 };

  const startGame = (name1 = 'Player 1', name2 = 'Player 2') => {
    player1 = Player(name1, 'X');
    player2 = Player(name2, 'O');
    currentPlayer = player1;
    isGameOver = false;
    Gameboard.resetBoard();
    DisplayController.render();
    DisplayController.updateMessage(`${currentPlayer.name}'s turn`);
  };

  const playTurn = (index) => {
    if (isGameOver || Gameboard.getBoard()[index] !== '') return;

    Gameboard.setMark(index, currentPlayer.mark);
    DisplayController.render();

    if (checkWin(currentPlayer.mark)) {
      DisplayController.updateMessage(`${currentPlayer.name} wins!`);
      scores[currentPlayer.mark]++;
      isGameOver = true;
      DisplayController.updateScore(scores);
      return;
    }

    if (checkTie()) {
      DisplayController.updateMessage("It's a tie!");
      isGameOver = true;
      return;
    }

    switchPlayer();
    DisplayController.updateMessage(`${currentPlayer.name}'s turn`);
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = (mark) => {
    const b = Gameboard.getBoard();
    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winCombos.some(c => c.every(i => b[i] === mark));
  };

  const checkTie = () => {
    return Gameboard.getBoard().every(cell => cell !== '');
  };

  const resetGame = () => {
    isGameOver = false;
    Gameboard.resetBoard();
    currentPlayer = player1;
    DisplayController.render();
    DisplayController.updateMessage(`${currentPlayer.name}'s turn`);
  };

  return { startGame, playTurn, resetGame };
})();

const DisplayController = (() => {
  const boardEl = document.getElementById('board');
  const messageEl = document.getElementById('message');
  const restartBtn = document.getElementById('restart');
  const startBtn = document.getElementById('startGame');
  const p1Input = document.getElementById('player1Name');
  const p2Input = document.getElementById('player2Name');

  const render = () => {
    boardEl.innerHTML = '';
    Gameboard.getBoard().forEach((mark, index) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.textContent = mark;
      cell.addEventListener('click', () => GameController.playTurn(index));
      boardEl.appendChild(cell);
    });
  };

  const updateMessage = (msg) => {
    messageEl.textContent = msg;
  };

  const updateScore = (scores) => {
    document.getElementById('scoreDisplay').textContent = 
      `X: ${scores.X} | O: ${scores.O}`;
  };

  restartBtn.addEventListener('click', () => {
    GameController.resetGame();
  });

  startBtn.addEventListener('click', () => {
    const name1 = p1Input.value || 'Player 1';
    const name2 = p2Input.value || 'Player 2';
    GameController.startGame(name1, name2);
  });

  return { render, updateMessage, updateScore };
})();
