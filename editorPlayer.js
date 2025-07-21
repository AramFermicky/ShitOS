// js/editorPlayer.js

export function initCharacterEditor() {
  const container = document.getElementById("character");
  container.innerHTML = `
    <h2>🧍 Редактор Персонажа</h2>
    <div class="toolbox">
      <label>Имя: <input type="text" id="playerName" value="Данил" /></label>
      <label>Скорость: <input type="number" id="playerSpeed" value="2" min="1" max="10" /></label>
      <label>Старт X: <input type="number" id="playerStartX" value="0" /></label>
      <label>Старт Y: <input type="number" id="playerStartY" value="0" /></label>
      <label>Спрайт: <input type="file" id="playerSprite" accept="image/png" /></label>
      <button id="savePlayer">💾 Сохранить .gis</button>
    </div>
    <div id="playerPreview"></div>
  `;

  const preview = document.getElementById("playerPreview");

  let spriteDataURL = null;

  document.getElementById("playerSprite").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      spriteDataURL = reader.result;

      const img = document.createElement("img");
      img.src = spriteDataURL;
      img.style.maxWidth = "64px";
      img.style.imageRendering = "pixelated";

      preview.innerHTML = "<p>Превью:</p>";
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("savePlayer").addEventListener("click", () => {
    const data = {
      name: document.getElementById("playerName").value || "Игрок",
      speed: parseInt(document.getElementById("playerSpeed").value) || 2,
      startX: parseInt(document.getElementById("playerStartX").value) || 0,
      startY: parseInt(document.getElementById("playerStartY").value) || 0,
      sprite: spriteDataURL || null
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "player.gis";
    a.click();
  });
}
