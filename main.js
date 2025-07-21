// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".menu-button");
  const pages = document.querySelectorAll(".page");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.dataset.target;

      pages.forEach((page) => {
        page.style.display = (page.id === targetId) ? "block" : "none";
      });

      // Инициализация editor.js при первом открытии
      if (targetId === "editor") {
        const page = document.getElementById("editor");
        if (!page.dataset.initialized) {
          const module = await import("./editor.js");
          if (module.initEditor) module.initEditor();
          page.dataset.initialized = "true";
        }
      }

      // Если нужно: подключение editor3d.js
      if (targetId === "editor3d") {
        const page = document.getElementById("editor3d");
        if (page && !page.dataset.initialized) {
          const module = await import("./editor3d.js");
          if (module.initEditor3D) module.initEditor3D();
          page.dataset.initialized = "true";
        }
      }

      // Если нужно: подключение game.js
      if (targetId === "game") {
        const page = document.getElementById("game");
        if (page && !page.dataset.initialized) {
          const module = await import("./game.js");
          if (module.initGame) module.initGame();
          page.dataset.initialized = "true";
        }
      }
    });
  });

  // Открыть первую вкладку по умолчанию
  buttons[0].click();
});
