// js/game.js

const container = document.getElementById('play');
if (!container.dataset.initialized) {
  container.dataset.initialized = 'true';
  container.innerHTML = `
    <h2>▶️ Режим Игры</h2>
    <p>Здесь будет запуск вашей игры на основе данных проекта.</p>
    <canvas id="gameCanvas" width="640" height="480" style="border:1px solid #fff;"></canvas>
  `;

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '20px monospace';
  ctx.fillText('Тут будет игра...', 180, 240);
}
