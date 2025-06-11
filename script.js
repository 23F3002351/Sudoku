const boardContainer = document.getElementById("sudoku-board");
const checkButton = document.getElementById("check");
const resetButton = document.getElementById("reset");
const newGameButton = document.getElementById("new-game");
const message = document.getElementById("message");

// Example puzzle: 0 = blank
const puzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function createBoard(puzzle) {
  boardContainer.innerHTML = '';
  puzzle.forEach((row, r) => {
    row.forEach((num, c) => {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.classList.add("cell");

      if (num !== 0) {
        input.value = num;
        input.disabled = true;
        input.classList.add("prefilled");
      } else {
        input.dataset.row = r;
        input.dataset.col = c;
      }

      boardContainer.appendChild(input);
    });
  });
}

function checkSolution() {
  const cells = document.querySelectorAll(".cell:not(.prefilled)");
  let valid = true;

  cells.forEach(cell => {
    const value = cell.value;
    if (!value || isNaN(value) || value < 1 || value > 9) {
      valid = false;
      cell.style.borderColor = "red";
    } else {
      cell.style.borderColor = "#ccc";
    }
  });

  message.textContent = valid ? "Looks good so far!" : "Some entries are invalid.";
}

function resetBoard() {
  const cells = document.querySelectorAll(".cell:not(.prefilled)");
  cells.forEach(cell => {
    cell.value = "";
    cell.style.borderColor = "#ccc";
  });
  message.textContent = "";
}

// Event Listeners
checkButton.addEventListener("click", checkSolution);
resetButton.addEventListener("click", resetBoard);
newGameButton.addEventListener("click", () => {
  // For now reload same puzzle
  createBoard(puzzle);
  message.textContent = "";
});

window.onload = () => createBoard(puzzle);

// Updates in script.js (continued)

function loadNewGame(difficulty = 'medium') {
  puzzle = generateSudoku(difficulty);
  createBoard(puzzle);
  resetTimer();
  startTimer();
  message.textContent = "";
}

function createBoard(puzzle, solved = false) {
  boardContainer.innerHTML = '';
  puzzle.forEach((row, r) => {
    row.forEach((num, c) => {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.classList.add("cell");

      if (num !== 0 && !solved) {
        input.value = num;
        input.disabled = true;
        input.classList.add("prefilled");
      } else {
        input.dataset.row = r;
        input.dataset.col = c;
      }

      input.addEventListener("input", () => validateCell(input));
      input.addEventListener("keydown", navigateBoard);
      boardContainer.appendChild(input);
    });
  });
}

function validateCell(cell) {
  const r = parseInt(cell.dataset.row);
  const c = parseInt(cell.dataset.col);
  const val = Number(cell.value);
  const cells = document.querySelectorAll(".cell");
  let valid = true;

  cells.forEach(other => {
    if (other !== cell && other.value == val) {
      const or = parseInt(other.dataset.row);
      const oc = parseInt(other.dataset.col);
      if (or === r || oc === c || (Math.floor(or / 3) === Math.floor(r / 3) && Math.floor(oc / 3) === Math.floor(c / 3))) {
        valid = false;
      }
    }
  });

  cell.style.borderColor = valid ? "#ccc" : "red";
}

function navigateBoard(e) {
  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const index = row * 9 + col;
  const cells = Array.from(document.querySelectorAll(".cell"));

  let targetIndex = index;
  if (e.key === 'ArrowRight') targetIndex++;
  else if (e.key === 'ArrowLeft') targetIndex--;
  else if (e.key === 'ArrowUp') targetIndex -= 9;
  else if (e.key === 'ArrowDown') targetIndex += 9;

  if (cells[targetIndex]) cells[targetIndex].focus();
}

function confirmReset() {
  if (confirm("Are you sure you want to reset the board?")) {
    resetBoard();
  }
}

// Attach new events
resetButton.removeEventListener("click", resetBoard);
resetButton.addEventListener("click", confirmReset);
newGameButton.addEventListener("click", () => loadNewGame("medium"));

// Add difficulty switch, dark mode, hint, manual solver, etc., later
window.onload = () => {
  loadStats();
  loadNewGame("medium");
};
