const board = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const gameStatus = document.getElementById('gameStatus');
const resetBtn = document.getElementById('resetBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const vsComputerBtn = document.getElementById('vsComputerBtn');

let boardState = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let vsComputer = false;
let winningLineElement = null;

const winningCombinations = [
    [0, 1, 2], 
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], 
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], 
    [2, 4, 6]
];

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (!gameActive || boardState[index]) return;

    makeMove(index, currentPlayer);
    if (checkWin(currentPlayer)) {
        endGame(false);
        return;
    }
    if (boardState.every(cell => cell !== null)) {
        endGame(true);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();

    if (vsComputer && currentPlayer === 'O' && gameActive) {
        computerMove();
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    cells[index].textContent = player;
}

function checkWin(player) {
    for (let combo of winningCombinations) {
        if (combo.every(i => boardState[i] === player)) {
            drawWinningLine(combo);
            return true;
        }
    }
    return false;
}

function drawWinningLine(combo) {
    clearWinningLine();
    const [a, b, c] = combo;
    let winningClass = '';

    if (currentPlayer === 'X') {
        winningClass = 'winning-cell-player1';
    } else if (currentPlayer === 'O') {
        if (vsComputer) {
            winningClass = 'winning-cell-computer';
        } else {
            winningClass = 'winning-cell-player2';
        }
    }

    cells[a].classList.add(winningClass);
    cells[b].classList.add(winningClass);
    cells[c].classList.add(winningClass);

    
}

function clearWinningLine() {
    cells.forEach(cell => {
        cell.classList.remove('winning-cell-player1');
        cell.classList.remove('winning-cell-player2');
        cell.classList.remove('winning-cell-computer');
    });
    if (winningLineElement) {
        winningLineElement.remove();
        winningLineElement = null;
    }
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        gameStatus.textContent = "It's a draw!";
    } else {
        gameStatus.textContent = `Player ${currentPlayer} wins!`;
    }
}

function updateStatus() {
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
    boardState.fill(null);
    cells.forEach(cell => cell.textContent = '');
    clearWinningLine();
    currentPlayer = 'X';
    gameActive = true;
    updateStatus();
}

function computerMove() {
    
    let emptyIndices = boardState
        .map((val, idx) => val === null ? idx : null)
        .filter(val => val !== null);

    if (emptyIndices.length === 0) return;

    // For better AI, implement minimax or other algorithm here
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(randomIndex, currentPlayer);

    if (checkWin(currentPlayer)) {
        endGame(false);
        return;
    }
    if (boardState.every(cell => cell !== null)) {
        endGame(true);
        return;
    }

    currentPlayer = 'X';
    updateStatus();
}

function setMode(vsComp) {
    vsComputer = vsComp;
    resetGame();
    if (vsComputer) {
        twoPlayerBtn.classList.remove('active');
        vsComputerBtn.classList.add('active');
    } else {
        twoPlayerBtn.classList.add('active');
        vsComputerBtn.classList.remove('active');
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
twoPlayerBtn.addEventListener('click', () => setMode(false));
vsComputerBtn.addEventListener('click', () => setMode(true));

updateStatus();
