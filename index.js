const WIDTH = 800;
const HEIGHT = 800;
const CELL_SIZE = 20;

const REFRESH_TIME = 100;

const canvas = document.getElementById("gol");
const ctx = canvas.getContext("2d");

const COLS = Math.floor(WIDTH / CELL_SIZE);
const ROWS = Math.floor(HEIGHT / CELL_SIZE);

canvas.width = WIDTH;
canvas.height = HEIGHT;

function buildGrid(nCols, nRows) {
  return new Array(nCols)
    .fill(null)
    .map(() =>
      new Array(nRows).fill(null).map(() => Math.floor(Math.random() * 2))
    );
}

function render(grid) {
  //   console.table(grid);
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      ctx.rect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.fillStyle = cell ? "black" : "white";
      ctx.fill();
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

let grid = buildGrid(COLS, ROWS);
render(grid);
setInterval(() => {
  update();
}, REFRESH_TIME);
