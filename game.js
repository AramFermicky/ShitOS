// js/game.js

import { showError } from "./errorMessage.js";

export function initGame() {
  const container = document.getElementById("game");
  container.innerHTML = `
    <h2>▶️ Запуск игры</h2>
    <canvas id="gameCanvas" width="512" height="512" style="background:#000;border:1px solid #555;"></canvas>
  `;

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const tileSize = 32;

  let mapData = null;
  let player = { x: 0, y: 0 };
  let tileset = null;

  try {
    const saved = JSON.parse(localStorage.getItem("ShitOS_map"));
    mapData = saved.grid;
    tileset = new Image();
    tileset.src = saved.tileset;
    tileset.onload = render;
  } catch (err) {
    showError("Ошибка загрузки карты: " + err.message);
    return;
  }

  try {
    const savedPlayer = JSON.parse(localStorage.getItem("ShitOS_player"));
    player = savedPlayer || player;
  } catch (err) {
    showError("Ошибка загрузки персонажа: " + err.message);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < mapData.length; y++) {
      for (let x = 0; x < mapData[0].length; x++) {
        const tile = mapData[y][x];
        if (tileset) {
          const tilesPerRow = Math.floor(tileset.width / tileSize);
          const sx = (tile % tilesPerRow) * tileSize;
          const sy = Math.floor(tile / tilesPerRow) * tileSize;
          ctx.drawImage(tileset, sx, sy, tileSize, tileSize, x * tileSize, y * tileSize, tileSize, tileSize);
        } else {
          ctx.fillStyle = tile === 0 ? "#111" : "#666";
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }

    ctx.fillStyle = "#00ffff";
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
  }

  function move(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (
      newX >= 0 && newY >= 0 &&
      newX < mapData[0].length &&
      newY < mapData.length &&
      mapData[newY][newX] === 0
    ) {
      player.x = newX;
      player.y = newY;
    }
    render();
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") move(0, -1);
    else if (e.key === "ArrowDown") move(0, 1);
    else if (e.key === "ArrowLeft") move(-1, 0);
    else if (e.key === "ArrowRight") move(1, 0);
  });
}
