// main.js — роутинг вкладок и инициализация ShitOS

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

      for (const tab in tabs) {
        const el = document.getElementById(tab);
        el.style.display = tab === tabName ? "block" : "none";
      }

      try {
        tabs[tabName]();
      } catch (e) {
        console.error(e);
        showError("Ошибка загрузки вкладки: " + tabName);
      }
    });
  });

  // По умолчанию показываем nothing до выбора
  main.style.display = "none";
});
