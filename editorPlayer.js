// editorPlayer.js — редактор персонажа со скинами и случайной генерацией

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

      <label>Загрузить спрайт PNG: <input id="charSprite" type="file" accept="image/png" /></label>
      <div id="charPreview"></div>

      <button id="randomChar">🎲 Случайный персонаж</button>
      <button id="saveChar">💾 Сохранить персонажа</button>
    </div>

    <h3>🎨 Скины</h3>
    <div class="toolbox">
      <input type="file" id="addSkinFile" accept="image/png" />
      <button id="clearSkins">🗑 Очистить все скины</button>
    </div>
    <div id="skinList" class="toolbox"></div>

    <pre id="charOutput" class="char-json"></pre>
  `;

  const spriteInput = document.getElementById("charSprite");
  const preview = document.getElementById("charPreview");
  const output = document.getElementById("charOutput");
  const skinList = document.getElementById("skinList");
  const addSkinInput = document.getElementById("addSkinFile");
  let spriteDataUrl = "";
  let skinData = [];

  // Загрузка скинов
  function loadSkins() {
    skinData = JSON.parse(localStorage.getItem("ShitOS_skins") || "[]");
    renderSkinList();
  }

  function saveSkins() {
    localStorage.setItem("ShitOS_skins", JSON.stringify(skinData));
  }

  function renderSkinList() {
    skinList.innerHTML = "";
    skinData.forEach((skin, idx) => {
      const btn = document.createElement("button");
      btn.innerHTML = `<img src="${skin}" width="32" height="32" style="border-radius:6px;" />`;
      btn.title = `Скин ${idx + 1}`;
      btn.onclick = () => {
        spriteDataUrl = skin;
        preview.innerHTML = `<img src="${spriteDataUrl}" width="64" height="64" />`;
      };
      skinList.appendChild(btn);
    });
  }

  // Загрузка PNG вручную
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

  // Случайный персонаж
  document.getElementById("randomChar").onclick = () => {
    const names = ["Данил", "Саня", "Михалыч", "Олдыч", "Герман", "Хавчик"];
    document.getElementById("charName").value = names[Math.floor(Math.random() * names.length)];
    document.getElementById("charSpeed").value = (1 + Math.random() * 3).toFixed(1);
    document.getElementById("charX").value = Math.floor(Math.random() * 10);
    document.getElementById("charY").value = Math.floor(Math.random() * 10);
    document.getElementById("charHP").value = 50 + Math.floor(Math.random() * 100);
    document.getElementById("charAtk").value = 5 + Math.floor(Math.random() * 20);
    document.getElementById("charScale").value = (0.5 + Math.random() * 1.5).toFixed(1);

    if (skinData.length > 0) {
      const randomSkin = skinData[Math.floor(Math.random() * skinData.length)];
      spriteDataUrl = randomSkin;
      preview.innerHTML = `<img src="${spriteDataUrl}" width="64" height="64" />`;
    }
  };

  // Сохранение
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

  addSkinInput.addEventListener("change", () => {
    const file = addSkinInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        skinData.push(reader.result);
        saveSkins();
        renderSkinList();
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("clearSkins").onclick = () => {
    if (confirm("Удалить все скины?")) {
      localStorage.removeItem("ShitOS_skins");
      skinData = [];
      renderSkinList();
    }
  };

  loadSkins();
}
