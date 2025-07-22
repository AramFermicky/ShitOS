// editor.js — простой 2D редактор с сеткой и кистью

export function initEditor() {
let objectMap = []; // структура объектов
  const container = document.getElementById("editor");
  container.innerHTML = `
    <h2>🧱 2D Редактор уровня</h2>
    <div class="toolbox">
<div class="toolbox">
  <label for="objectSelect">Объект:</label>
  <select id="objectSelect">
    <option value="">— нет —</option>
    <option value="portal">🔵 Портал</option>
    <option value="door">🚪 Дверь</option>
    <option value="key">🗝 Ключ</option>
    <option value="enemy">👾 Враг</option>
    <option value="event">💬 Событие</option>
    <option value="item">📦 Предмет</option>
  </select>
</div>
      <label for="tileInput">Тайл:</label>
      <input type="number" id="tileInput" value="1" min="0" max="999" style="width:60px" />
      <button id="resizeMap">📐 Изменить размер</button>
      <button id="fillTool">🪣 Заливка</button>
      <button id="saveMap">💾 Сохранить</button>
      <button id="loadMap">📂 Загрузить</button>
    </div>
    <canvas id="editorCanvas" width="512" height="512" style="border:1px solid #999;"></canvas>
  `;

  const canvas = document.getElementById("editorCanvas");
  const ctx = canvas.getContext("2d");
  const tileSize = 32;
  let rows = canvas.height / tileSize;
  let cols = canvas.width / tileSize;

  let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  objectMap = Array.from({ length: rows }, () => Array(cols).fill(null))

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const val = grid[y][x];
        ctx.fillStyle = val === 0 ? "#111" : `hsl(${val * 40 % 360}, 80%, 50%)`;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        ctx.strokeStyle = "#444";
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / tileSize);
  const y = Math.floor((e.clientY - rect.top) / tileSize);
  const tile = parseInt(document.getElementById("tileInput").value);
  const objType = document.getElementById("objectSelect").value;

  if (x >= 0 && y >= 0 && x < cols && y < rows) {
    if (objType) {
      objectMap[y][x] = { type: objType };
    } else if (currentTool === "brush") {
      grid[y][x] = tile;
    } else if (currentTool === "fill") {
      const target = grid[y][x];
      if (target !== tile) floodFill(x, y, target, tile);
    }
    drawGrid();
  }
});

  document.getElementById("resizeMap").onclick = () => {
  const newCols = parseInt(prompt("Новая ширина (в тайлах):", cols));
  const newRows = parseInt(prompt("Новая высота (в тайлах):", rows));
  if (isNaN(newCols) || isNaN(newRows)) return alert("Некорректный ввод");

  const newGrid = Array.from({ length: newRows }, (_, y) =>
    Array.from({ length: newCols }, (_, x) => grid?.[y]?.[x] ?? 0)
  );

  grid = newGrid;
  canvas.width = newCols * tileSize;
  canvas.height = newRows * tileSize;

  // Обновляем кол-во строк и столбцов
  rows = newRows;
  cols = newCols;

  for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    const obj = objectMap[y][x];
    if (!obj) continue;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "16px monospace";
    ctx.fillText(obj.type[0].toUpperCase(), x * tileSize + 8, y * tileSize + 24);
  }
}
  drawGrid();
};
    const tilesetDataUrl = ""; // можно позже добавить загрузку PNG тайлсета
    const data = {
      grid,
      tileset: tilesetDataUrl
    };
    localStorage.setItem("ShitOS_map", JSON.stringify(data));
    alert("Карта сохранена в localStorage");
  };
  document.getElementById("saveMap").onclick = () => {
  const data = {
    grid,
    objectMap,
    tileset: ""
  };
  localStorage.setItem("ShitOS_map", JSON.stringify(data));
  alert("Карта с объектами сохранена!");
};
  document.getElementById("loadMap").onclick = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("ShitOS_map"));
      grid = saved.grid;
      drawGrid();
    } catch (e) {
      alert("Ошибка загрузки карты");
    }
  };
      let currentTool = "brush"; // brush | fill

  drawGrid();
}
