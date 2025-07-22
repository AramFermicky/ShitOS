// game.js — запуск игры из localStorage (после загрузки .gap или редакторов)

import { showError } from "./errorMessage.js";

export function initGame() {
  const container = document.getElementById("game");
  container.innerHTML = `
    <h2>🎮 Запуск Игры</h2>
    <canvas id="gameCanvas" width="512" height="512" style="border:1px solid #999;"></canvas>
  `;

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const tileSize = 32;
  let map, character;

  try {
    map = JSON.parse(localStorage.getItem("ShitOS_map"));
    character = JSON.parse(localStorage.getItem("ShitOS_character"));
    if (!map || !map.grid || !character) throw new Error("Отсутствует карта или персонаж");
  } catch (e) {
    showError("Невозможно запустить игру: " + e.message);
    return;
  }

  let player = {
    x: character.startX || 1,
    y: character.startY || 1,
    color: character.color || "#0f0"
  };

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rows = map.grid.length;
    const cols = map.grid[0].length;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const val = map.grid[y][x];
        ctx.fillStyle = val === 0 ? "#111" : `hsl(${val * 40 % 360}, 70%, 50%)`;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        ctx.strokeStyle = "#333";
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    // Персонаж
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
  }

  function movePlayer(dx, dy) {
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (ny >= 0 && ny < map.grid.length && nx >= 0 && nx < map.grid[0].length) {
      player.x = nx;
      player.y = ny;
      draw();
    }
  }

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp": movePlayer(0, -1); break;
      case "ArrowDown": movePlayer(0, 1); break;
      case "ArrowLeft": movePlayer(-1, 0); break;
      case "ArrowRight": movePlayer(1, 0); break;
    }
  });

  draw();
}
