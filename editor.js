// js/editor.js

import { showError } from "./errorMessage.js";

export function initEditor() {
  const container = document.getElementById("editor");
  container.innerHTML = `
    <h2>🧱 Редактор 2D-карты</h2>
    <div class="toolbox">
      <input type="file" id="tilesetInput" accept="image/png" />
      <button id="brushTool">🖌 Кисть</button>
      <button id="eraserTool">❌ Ластик</button>
      <button id="fillTool">🪣 Заливка</button>
      <button id="exportMap">💾 Сохранить .gis</button>
      <input type="file" id="importMap" accept=".gis" />
    </div>
    <canvas id="mapCanvas" width="512" height="512" style="background:#222;border:1px solid #555;"></canvas>
  `;

  const canvas = document.getElementById("mapCanvas");
  const ctx = canvas.getContext("2d");
  const tileSize = 32;
  const cols = 16;
  const rows = 16;

  let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  let tileset = null;
  let selectedTile = 0;
  let tool = "brush";

  // Event listeners
  document.getElementById("tilesetInput").addEventListener("change", handleTilesetLoad);
  document.getElementById("brushTool").onclick = () => tool = "brush";
  document.getElementById("eraserTool").onclick = () => tool = "eraser";
  document.getElementById("fillTool").onclick = () => tool = "fill";
  document.getElementById("exportMap").onclick = handleExport;
  document.getElementById("importMap").addEventListener("change", handleImport);

  canvas.addEventListener("click", (e) => {
    const x = Math.floor(e.offsetX / tileSize);
    const y = Math.floor(e.offsetY / tileSize);

    if (tool === "brush") {
      grid[y][x] = selectedTile;
    } else if (tool === "eraser") {
      grid[y][x] = 0;
    } else if (tool === "fill") {
      floodFill(x, y, grid[y][x], selectedTile);
    }

    drawGrid();
  });

  function handleTilesetLoad(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      tileset = new Image();
      tileset.onload = drawGrid;
      tileset.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function floodFill(x, y, target, replacement) {
    if (target === replacement) return;
    const stack = [[x, y]];

    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) continue;
      if (grid[cy][cx] !== target) continue;

      grid[cy][cx] = replacement;
      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }
  }

  function handleExport() {
    if (!tileset) return showError("Сначала загрузите тайлсет!");

    const data = {
      grid,
      tileset: tileset.src
    };

    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "map.gis";
    a.click();

    localStorage.setItem("ShitOS_map", JSON.stringify(data));
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        grid = data.grid || grid;

        if (data.tileset) {
          tileset = new Image();
          tileset.onload = drawGrid;
          tileset.src = data.tileset;
        } else {
          drawGrid();
        }

        localStorage.setItem("ShitOS_map", JSON.stringify(data));
      } catch (err) {
        showError("Ошибка импорта .gis: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = grid[y][x];
        if (tileset) {
          const tilesPerRow = Math.floor(tileset.width / tileSize);
          const sx = (tile % tilesPerRow) * tileSize;
          const sy = Math.floor(tile / tilesPerRow) * tileSize;
          ctx.drawImage(tileset, sx, sy, tileSize, tileSize, x * tileSize, y * tileSize, tileSize, tileSize);
        } else {
          ctx.fillStyle = tile === 0 ? "#222" : "#666";
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }

        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }

  drawGrid();
}
