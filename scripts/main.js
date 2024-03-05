let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

let storedScore = localStorage.getItem('score');

let score = storedScore ? JSON.parse(storedScore) : [
  {
    symbol: 'x',
    name: 'X (YOU)',
    score: 0,
  }, {
    symbol: 'ties',
    name: 'TIES',
    score: 0,
  }, {
    symbol: 'o',
    name: 'O (CPU)',
    score: 0,
  }
];

function markBoard(rowIndex, elementIndex, sign) {
  board[rowIndex][elementIndex] = sign;
}

function stillPlayGame () {
  let flatBoard = board.flat(Infinity);
  return flatBoard.includes('');
}

function checkGameBoard() {
  const gameStatus = stillPlayGame();
  
  checkHorizontal();
  checkVertical();
  checkCross();

  if ((gameStatus === false ) && (scoreUpdated === false)) {
    console.log('Tied');
    setTimeout(() => {
      generatePopoverHTML('BETTER LUCK NEXT TIME', 'TIE', 'TRY AGAIN');
    }, 500);
    updateScore([]);
  }
}

function checkHorizontal () {
  board.forEach((row) => {
    checkWin(row);
  })
}

function checkVertical () {
  for (let columnNumber = 0; columnNumber < board.length; columnNumber++) {
    let column = board.map((row) => {
      return row[columnNumber];
    })
    checkWin(column);
  }
}

function checkCross () {
  let leftNumber = 0;
  let crossLeft = board.map((row) => {
    return row[leftNumber++]
  })
  let rightNumber = 2
  let crossRight = board.map((row) => {
    return row[rightNumber--]
  })
  checkWin(crossLeft);
  checkWin(crossRight);
}

function checkWin(newArray) {
  if (newArray.includes('')) {
  } else if (newArray.every((ele) => ele === newArray[0])) {
    setTimeout(() => {
      generatePopoverHTML('YOU WON', newArray[0], 'TAKES THE ROUND');
    }, 500);
    updateScore(newArray[0]);
  }
}

function updateScore(winningSign) {
  if (winningSign === 'X') {
    score[0].score += 1;
    document.querySelector('.js-x-score').textContent = `${score[0].score}`;
  } else if (winningSign === 'O') {
    score[2].score += 1;
    document.querySelector('.js-o-score').textContent = `${score[2].score}`;
  } else {
    score[1].score += 1;
    document.querySelector('.js-ties-score').textContent = `${score[1].score}`;
  }
  storeScore();
}

let scoreUpdated = false;

function storeScore () {
  localStorage.setItem('score', JSON.stringify(score));
  scoreUpdated = true;
}

function clearGame() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  document.querySelector('.js-tile-container')
  .innerHTML = '';
  generateBoardHTML();
  markHTMLBoard();
  scoreUpdated = false;
  console.log(board);
}

function resetGame () {
  document.querySelector('.js-reset-button')
    .addEventListener('click', () => {
      clearGame();
    })
}

resetGame();

function generateBoardHTML () {
  board.forEach((row, rowIndex) => {
    row.forEach((element, elementIndex) => {
      document.querySelector('.js-tile-container')
        .innerHTML += 
        `
          <button class="tile-button js-tile-button" data-button-row="${rowIndex}" data-button-element="${elementIndex}">${element}</button>
        `
    })
  })
}

generateBoardHTML();

function generateScoreHTML () {
  score.forEach((box) => {
    const scoreHTMl = 
      `
      <div class="${box.symbol}-score-container">
        <div class="${box.symbol}-choose">
          ${box.name}
        </div>
        <div class="${box.symbol}-score js-${box.symbol}-score">
          ${box.score}
        </div>
      </div>
      `
    document.querySelector('.js-score-container')
    .innerHTML += scoreHTMl;
  })
}

generateScoreHTML();

let turn = 'X'; // Define turn variable outside the function

function markHTMLBoard() {
  const buttons = document.querySelectorAll('.js-tile-button');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.textContent === '') {
        if(turn === 'X') {
          button.classList.add('x-color');
        } else if (turn === 'O') {
          button.classList.add('o-color');
        }
        button.textContent = turn;
        const rowIndex = Number(button.dataset.buttonRow);
        const elementIndex = Number(button.dataset.buttonElement);
        markBoard(rowIndex, elementIndex, turn);
        console.log(board);
        checkGameBoard();

        // Toggle turn between 'X' and 'O'
        turn = turn === 'X' ? 'O' : 'X';
        document.querySelector('.js-turns-icon').textContent = turn;
      }
    });
  });
}

markHTMLBoard();

function generatePopoverHTML (gameStatus ,wonSign, tagline) {
  const popoverHTML = document.querySelector('.js-popover-container');
  popoverHTML.innerHTML = 
    `
      <div class="popover-shadow">
        <div class="popover-background">
          <div class="you-won">
            ${gameStatus}!
          </div>
          <div class="win-status">
            <div class="who-won">
              ${wonSign}
            </div>
            <div class="tag-line">
              ${tagline}
            </div>
          </div>
          <div class="next-game-status">
            <button class="quit-button js-quit-button">
              QUIT
            </button>
            <button class="next-round-button js-next-round-button">
              NEXT ROUND
            </button>
          </div>
        </div>
      </div>
    `

    document.querySelector('.js-quit-button')
      .addEventListener('click', () => {
        clearGame();
        popoverHTML.innerHTML = '';
      })

    document.querySelector('.js-next-round-button')
    .addEventListener('click', () => {
      clearGame();
      popoverHTML.innerHTML = '';
    })
}