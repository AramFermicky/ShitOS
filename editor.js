// js/editor.js

import { saveAsGIS } from "./export.js";
import { loadGISFile } from "./loader.js";

export function initEditor() {
  const container = document.getElementById("editor");
  container.innerHTML = `
    <h2>🧱 Редактор 2D</h2>
    <div class="toolbox">
      <label>Слой:
        <select id="layerSelect">
          <option value="background">Фон</option>
          <option value="collision">Коллизии</option>
        </select>
      </label>

      <span id="collisionTypePanel" style="display:none;">
        Тип:
        <select id="collisionTypeSelect">
          <option value="none">🟩 Проходимо</option>
          <option value="wall">🟥 Стена</option>
          <option value="water">💧 Вода</option>
          <option value="spikes">⚠️ Шипы</option>
          <option value="portal">🚪 Портал</option>
        </select>
      </span>

      <input type="color" id="colorPicker" value="#00ff00" />
      <button id="clearCanvas">🧹 Очистить</button>
      <button id="saveGIS">💾 Сохранить</button>
      <input type="file" id="loadGIS" accept=".gis,.json" style="display:none;" />
      <button onclick="document.getElementById('loadGIS').click()">📥 Загрузить</button>
    </div>

    <canvas id="canvas2d" width="512" height="512"></canvas>
  `;

  const canvas = document.getElementById("canvas2d");
  const ctx = canvas.getContext("2d");

  const TILE_SIZE = 32;
  const COLS = canvas.width / TILE_SIZE;
  const ROWS = canvas.height / TILE_SIZE;

  let currentLayer = "background";
  let selectedCollisionType = "wall";

  const createEmptyLayer = (rows, cols, defaultValue = null) =>
    Array.from({ length: rows }, () => Array(cols).fill(defaultValue));

  const mapData = {
    layers: {
      background: createEmptyLayer(ROWS, COLS),
      collision: createEmptyLayer(ROWS, COLS, { type: "none" })
    }
  };

  const emojiFor = {
    wall: "🟥",
    water: "💧",
    spikes: "⚠️",
    portal: "🚪",
    none: "🟩"
  };

  function drawTile(x, y) {
    const bg = mapData.layers.background[y][x];
    ctx.fillStyle = bg || "#111";
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    const col = mapData.layers.collision[y][x];
    if (col?.type && col.type !== "none") {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "16px sans-serif";
      ctx.fillText(emojiFor[col.type] || "❓", x * TILE_SIZE + 8, y * TILE_SIZE + 24);
    }

    ctx.strokeStyle = "#444";
    ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  function redrawCanvas() {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        drawTile(x, y);
      }
    }
  }

  function clearCanvas() {
    mapData.layers.background = createEmptyLayer(ROWS, COLS);
    mapData.layers.collision = createEmptyLayer(ROWS, COLS, { type: "none" });
    redrawCanvas();
  }

  let mouseDown = false;

  canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    paint(e);
  });

  canvas.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) paint(e);
  });

  function paint(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;

    if (currentLayer === "background") {
      mapData.layers.background[y][x] = document.getElementById("colorPicker").value;
    } else if (currentLayer === "collision") {
      mapData.layers.collision[y][x] = { type: selectedCollisionType };
    }

    drawTile(x, y);
  }

  // UI handlers
  document.getElementById("layerSelect").onchange = (e) => {
    currentLayer = e.target.value;
    document.getElementById("collisionTypePanel").style.display =
      currentLayer === "collision" ? "inline-block" : "none";
  };

  document.getElementById("collisionTypeSelect").onchange = (e) => {
    selectedCollisionType = e.target.value;
  };

  document.getElementById("clearCanvas").onclick = clearCanvas;

  document.getElementById("saveGIS").onclick = () => {
    saveAsGIS(mapData);
  };

  document.getElementById("loadGIS").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      loadGISFile(file, (data) => {
        mapData.layers.background = data.layers.background || createEmptyLayer(ROWS, COLS);
        mapData.layers.collision = data.layers.collision || createEmptyLayer(ROWS, COLS, { type: "none" });
        redrawCanvas();
      });
    }
  });

  clearCanvas();
}
