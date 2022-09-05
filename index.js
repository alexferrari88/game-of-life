const WIDTH = 800;
const HEIGHT = 800;
let CELL_SIZE = 40;

let REFRESH_TIME = 100;

const canvas = document.getElementById("gol");
const startButton = document.getElementById("start");
const clearButton = document.getElementById("clear");
const randomButton = document.getElementById("random");
const speedSlider = document.getElementById("speed");
const sizeSlider = document.getElementById("size");
const ctx = canvas.getContext("2d");

let COLS = Math.floor(WIDTH / CELL_SIZE);
let ROWS = Math.floor(HEIGHT / CELL_SIZE);

let interval;

canvas.width = WIDTH;
canvas.height = HEIGHT;

function buildGrid(nCols, nRows, fillerFunc) {
  if (!fillerFunc) fillerFunc = () => Math.floor(Math.random() * 2);
  return new Array(nCols)
    .fill(null)
    .map(() => new Array(nRows).fill(null).map(fillerFunc));
}

function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      ctx.rect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.fillStyle = cell ? "black" : "white";
      ctx.fill();
      ctx.stroke();
    }
  }
}

function getCellVitality(cell, aliveNeighbours) {
  if (cell === 1) {
    if (aliveNeighbours < 2) {
      return 0;
    } else if (aliveNeighbours === 2 || aliveNeighbours === 3) {
      return 1;
    } else if (aliveNeighbours > 3) {
      return 0;
    }
  } else if (cell === 0) {
    if (aliveNeighbours === 3) return 1;
  }
  return cell;
}

function buildNextGenGrid(grid) {
  const nextGrid = grid.map((col) => [...col]);
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let aliveNeighbours = 0;
      // loop through the adjacent neighbours of the selected cell
      for (let c = -1; c < 2; c++) {
        for (let r = -1; r < 2; r++) {
          if (c === 0 && r === 0) continue;
          const neighbourX = col + c;
          const neighbourY = row + r;
          if (
            neighbourX >= 0 &&
            neighbourY >= 0 &&
            neighbourX < COLS &&
            neighbourY < ROWS
          ) {
            const neighbourCell = grid[neighbourX][neighbourY];
            aliveNeighbours += neighbourCell;
          }
        }
      }
      nextGrid[col][row] = getCellVitality(cell, aliveNeighbours);
    }
  }
  return nextGrid;
}

function update() {
  grid = buildNextGenGrid(grid);
  render(grid);
}

function startClickHandler(e) {
  const btn = e.target;
  if (interval) {
    clearInterval(interval);
    interval = null;
    btn.innerText = "Start";
  } else {
    interval = setInterval(update, REFRESH_TIME);
    btn.innerText = "Stop";
  }
}

function cellClickHandler(e) {
  stopInterval();
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  const [col, row] = getCellFromXY(x, y);
  // toggle the cell
  grid[col][row] = grid[col][row] ? 0 : 1;
  render(grid);
}

function clearClickHandler() {
  stopInterval();
  grid = buildGrid(COLS, ROWS, () => 0);
  render(grid);
}

function randomClickHandler() {
  stopInterval();
  grid = buildGrid(COLS, ROWS);
  render(grid);
}

function stopInterval() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    startButton.innerText = "Start";
  }
}

function sizeChangeHandler(e) {
  stopInterval();
  CELL_SIZE = e.target.value;
  COLS = Math.floor(WIDTH / CELL_SIZE);
  ROWS = Math.floor(HEIGHT / CELL_SIZE);
  grid = buildGrid(COLS, ROWS, () => 0);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  render(grid);
}

function speedChangeHandler(e) {
  const speed = 1000 - e.target.value;
  REFRESH_TIME = speed;
  if (interval) {
    clearInterval(interval);
    interval = setInterval(update, speed);
  }
}

function getCellFromXY(x, y) {
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);
  return [col, row];
}

let grid = buildGrid(COLS, ROWS, () => 0);
render(grid);

canvas.addEventListener("click", cellClickHandler);
startButton.addEventListener("click", startClickHandler);
clearButton.addEventListener("click", clearClickHandler);
randomButton.addEventListener("click", randomClickHandler);
speedSlider.addEventListener("change", speedChangeHandler);
sizeSlider.addEventListener("change", sizeChangeHandler);
