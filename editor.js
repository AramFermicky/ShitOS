// editor.js — простой 2D редактор с сеткой и кистью

export function initEditor() {
  const container = document.getElementById("editor");
  container.innerHTML = `
    <h2>🧱 2D Редактор уровня</h2>
    <div class="toolbox">
      <label for="tileInput">Тайл:</label>
      <input type="number" id="tileInput" value="1" min="0" max="999" style="width:60px" />
      <button id="saveMap">💾 Сохранить</button>
      <button id="loadMap">📂 Загрузить</button>
    </div>
    <canvas id="editorCanvas" width="512" height="512" style="border:1px solid #999;"></canvas>
  `;

  const canvas = document.getElementById("editorCanvas");
  const ctx = canvas.getContext("2d");
  const tileSize = 32;
  const rows = canvas.height / tileSize;
  const cols = canvas.width / tileSize;

  let grid = Array.from({ length: rows }, () => Array(cols).fill(0));

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
    if (x >= 0 && y >= 0 && x < cols && y < rows) {
      grid[y][x] = tile;
      drawGrid();
    }
  });

  document.getElementById("saveMap").onclick = () => {
    const tilesetDataUrl = ""; // можно позже добавить загрузку PNG тайлсета
    const data = {
      grid,
      tileset: tilesetDataUrl
    };
    localStorage.setItem("ShitOS_map", JSON.stringify(data));
    alert("Карта сохранена в localStorage");
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

  drawGrid();
}
