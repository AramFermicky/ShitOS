// main.js — роутинг вкладок и инициализация ShitOS

import { initGamePlayer } from "./game.js";
import { initGfmImporter } from "./gfmImporter.js";
import { initBlockbench } from "./blockbench.js";
import { initPullEditor } from "./pullEditor.js";
import { initEditor } from "./editor.js";
import { initEditor3D } from "./editor3d.js";
import { initCharacterEditor } from "./editorPlayer.js";
import { initExport } from "./export.js";
import { initGame } from "./game.js";
import { loadGisFile } from "./loader.js";
import { showError } from "./errorMessage.js";
import { initProjectManager } from "./editorProject.js";

window.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  const nav = document.querySelector("nav");
  const deviceSelect = document.getElementById("deviceSelect");

  // Предменю выбора устройства
  document.getElementById("selectPC").onclick = () => {
    document.body.classList.remove("device-mobile");
    deviceSelect.style.display = "none";
    main.style.display = "block";
  };
  document.getElementById("selectMobile").onclick = () => {
    document.body.classList.add("device-mobile");
    deviceSelect.style.display = "none";
    main.style.display = "block";
  };

  const tabs = {
    play: initGamePlayer,
    gfmimport: initGfmImporter,
    blockbench: initBlockbench,
    puller: initPullEditor,
    editor: initEditor,
    editor3d: initEditor3D,
    character: initCharacterEditor,
    exporter: initExport,
    game: initGame,
    projects: initProjectManager
  };

nav.querySelectorAll("button[data-tab]").forEach(btn => {
  btn.addEventListener("click", () => {
    const tabName = btn.dataset.tab;

    // Скрываем и показываем вкладки
    for (const tab in tabs) {
      const el = document.getElementById(tab);
      el.style.display = tab === tabName ? "block" : "none";
    }

    // Подсвечиваем активную кнопку
    nav.querySelectorAll(".menu-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Инициализация вкладки
    try {
      tabs[tabName]();
    } catch (e) {
      console.error(e);
      showError("Ошибка загрузки вкладки: " + tabName);
    }
  });
});
// --- Настройка вкладок ---
const allTabs = {
  editor: "🧱 Уровень",
  editor3d: "🔲 3D",
  character: "🧍 Персонаж",
  exporter: "📦 Экспорт",
  game: "▶️ Играть",
  projects: "📁 Проекты"
};

// Загрузка конфигурации из localStorage
let userTabs = JSON.parse(localStorage.getItem("ShitOS_tabConfig") || "{}");

function getEnabledTabs() {
  const result = {};
  for (const key in allTabs) {
    if (userTabs[key] !== false) {
      result[key] = allTabs[key];
    }
  }
  return result;
}

function renderNavButtons() {
  nav.innerHTML = "";
  const enabledTabs = getEnabledTabs();
  for (const key in enabledTabs) {
    const btn = document.createElement("button");
    btn.className = "menu-button";
    btn.dataset.tab = key;
    btn.innerText = enabledTabs[key];
    nav.appendChild(btn);
  }
  // Добавим кнопку настроек
  const configBtn = document.createElement("button");
  configBtn.id = "menuSettings";
  configBtn.innerText = "⚙️ Настроить меню";
  nav.appendChild(configBtn);
  rebindTabHandlers();
}

function rebindTabHandlers() {
  nav.querySelectorAll("button[data-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;

      for (const tab in allTabs) {
        const el = document.getElementById(tab);
        if (el) el.style.display = tab === tabName ? "block" : "none";
      }

      nav.querySelectorAll(".menu-button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      try {
        tabs[tabName]();
      } catch (e) {
        console.error(e);
        showError("Ошибка загрузки вкладки: " + tabName);
      }
    });
  });

  const configBtn = document.getElementById("menuSettings");
  if (configBtn) {
    configBtn.onclick = () => {
      const modal = document.getElementById("menuModal");
      const options = document.getElementById("menuOptions");
      options.innerHTML = "";

      for (const key in allTabs) {
        const label = document.createElement("label");
        label.innerHTML = `
          <span>${allTabs[key]}</span>
          <input type="checkbox" data-key="${key}" ${userTabs[key] !== false ? "checked" : ""} />
        `;
        options.appendChild(label);
      }

      modal.style.display = "flex";
    };
  }
}

// Сохранение конфигурации меню
document.getElementById("saveMenuConfig").onclick = () => {
  const checkboxes = document.querySelectorAll("#menuOptions input[type=checkbox]");
  checkboxes.forEach(ch => {
    userTabs[ch.dataset.key] = ch.checked;
  });
  localStorage.setItem("ShitOS_tabConfig", JSON.stringify(userTabs));
  document.getElementById("menuModal").style.display = "none";
  renderNavButtons();
};

// Закрыть окно
document.getElementById("closeMenuModal").onclick = () => {
  document.getElementById("menuModal").style.display = "none";
};

// Рендер при старте
renderNavButtons();

  // По умолчанию показываем nothing до выбора
  main.style.display = "none";
});
