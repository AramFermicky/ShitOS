// game.js — запуск игры из localStorage (после загрузки .gap или редакторов)

import { showError } from "./errorMessage.js";

export function initGamePlayer() {
  document.getElementById("play").innerHTML = `<canvas id="gameCanvas" width="512" height="512" style="border:1px solid #444"></canvas>`;
  initGame(); // ← твоя основная функция запуска (внутри game.js)
}

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
const objectMap = map.objectMap || [];
const allProjects = JSON.parse(localStorage.getItem("ShitOS_projects") || "[]");
const links = JSON.parse(localStorage.getItem("ShitOS_links") || "[]");
    if (!map || !map.grid || !character) throw new Error("Отсутствует карта или персонаж");
  } catch (e) {
    showError("Невозможно запустить игру: " + e.message);
    return;
  }

  let player = {
    x: character.startX || 1,
    y: character.startY || 1,
    color: character.color || "#0f0"
let inventory = {
  keys: 0
};
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
        const obj = objectMap[y][x];
if (obj?.type === "portal") {
        ctx.fillStyle = "#00f5";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}
const obj = objectMap[y][x];
if (obj?.type === "portal") {
  ctx.fillStyle = "#00f5";
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}
if (obj?.type === "door") {
  ctx.fillStyle = "#a55";
  ctx.fillRect(x * tileSize + 8, y * tileSize + 8, tileSize - 16, tileSize - 16);
}
if (obj?.type === "key") {
  ctx.fillStyle = "#ff0";
  ctx.beginPath();
  ctx.arc(x * tileSize + 16, y * tileSize + 16, 6, 0, Math.PI * 2);
  ctx.fill();
}
if (obj?.type === "enemy") {
  ctx.fillStyle = "#f00";
  ctx.fillRect(x * tileSize + 8, y * tileSize + 8, tileSize - 16, tileSize - 16);
}
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
const obj = objectMap?.[ny]?.[nx];
if (obj) {
  switch (obj.type) {
    case "key":
      inventory.keys++;
      objectMap[ny][nx] = null;
      alert("🔑 Поднят ключ! Теперь у тебя ключей: " + inventory.keys);
      break;

    case "door":
      if (inventory.keys > 0) {
        inventory.keys--;
        objectMap[ny][nx] = null;
        alert("🚪 Дверь открыта! Осталось ключей: " + inventory.keys);
      } else {
        alert("🚫 Дверь закрыта. Нужен ключ.");
        return; // не двигаем игрока
      }
      break;

    case "enemy":
      alert("👾 Враг! Пока ты не умеешь сражаться...");
      return; // враг блокирует путь
  }
}

    // Проверка на портал
    const obj = objectMap?.[ny]?.[nx];
    if (obj?.type === "portal") {
      const fromIdx = allProjects.findIndex(p => JSON.stringify(p.data?.grid) === JSON.stringify(map.grid));
      const link = links.find(l => l.from === fromIdx && l.x === nx && l.y === ny);
      if (link) {
        const targetScene = allProjects[link.to];
        if (targetScene) {
          localStorage.setItem("ShitOS_map", JSON.stringify(targetScene.data));
          alert(`Телепорт в сцену "${targetScene.name}"`);
          initGame(); // перезапуск сцены
          return;
        }
      }
    }

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
