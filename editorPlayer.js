// editorPlayer.js — расширенный редактор персонажа

export function initCharacterEditor() {
  const container = document.getElementById("character");
  container.innerHTML = `
    <h2>🧍‍♂️ Редактор персонажа</h2>
    <div class="char-settings">
      <label>Имя: <input id="charName" type="text" placeholder="Герой" /></label>
      <label>Скорость: <input id="charSpeed" type="number" value="2" min="1" /></label>
      <label>Позиция X: <input id="charX" type="number" value="0" /></label>
      <label>Позиция Y: <input id="charY" type="number" value="0" /></label>
      <label>Здоровье: <input id="charHP" type="number" value="100" min="0" /></label>
      <label>Атака: <input id="charAtk" type="number" value="10" min="0" /></label>
      <label>Размер: <input id="charScale" type="number" value="1" step="0.1" min="0.1" /></label>
      <label>Спрайт PNG: <input id="charSprite" type="file" accept="image/png" /></label>
      <div id="charPreview"></div>
      <button id="saveChar">💾 Сохранить персонажа</button>
    </div>
    <pre id="charOutput" class="char-json"></pre>
  `;

  const spriteInput = document.getElementById("charSprite");
  const preview = document.getElementById("charPreview");
  const output = document.getElementById("charOutput");
  let spriteDataUrl = "";

  spriteInput.addEventListener("change", () => {
    const file = spriteInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        spriteDataUrl = reader.result;
        preview.innerHTML = `<img src="${spriteDataUrl}" width="64" height="64" />`;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("saveChar").onclick = () => {
    const character = {
      name: document.getElementById("charName").value,
      speed: parseFloat(document.getElementById("charSpeed").value),
      x: parseInt(document.getElementById("charX").value),
      y: parseInt(document.getElementById("charY").value),
      hp: parseInt(document.getElementById("charHP").value),
      attack: parseInt(document.getElementById("charAtk").value),
      scale: parseFloat(document.getElementById("charScale").value),
      sprite: spriteDataUrl
    };

    localStorage.setItem("ShitOS_character", JSON.stringify(character));
    output.textContent = JSON.stringify(character, null, 2);
    alert("Персонаж сохранён в localStorage!");
  };
}
