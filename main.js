// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const deviceScreen = document.getElementById("deviceSelect");
  const mainUI = document.getElementById("mainInterface");

  const buttons = document.querySelectorAll(".menu-button");
  const pages = document.querySelectorAll(".page");

  const selectedDevice = localStorage.getItem("ShitOS_device");
  if (!selectedDevice) {
    deviceScreen.style.display = "flex";
    document.getElementById("selectDesktop").onclick = () => {
      localStorage.setItem("ShitOS_device", "desktop");
      startShitOS();
    };
    document.getElementById("selectMobile").onclick = () => {
      localStorage.setItem("ShitOS_device", "mobile");
      startShitOS();
    };
  } else {
    startShitOS();
  }

  function startShitOS() {
    deviceScreen.style.display = "none";
    mainUI.style.display = "block";

    const device = localStorage.getItem("ShitOS_device");
    document.body.classList.add(`device-${device}`);

    buttons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const targetId = btn.dataset.target;

        pages.forEach((page) => {
          page.style.display = page.id === targetId ? "block" : "none";
        });

        const page = document.getElementById(targetId);
        if (page.dataset.initialized === "true") return;

        try {
          if (targetId === "editor") {
            const module = await import("./editor.js");
            module.initEditor();
          } else if (targetId === "editor3d") {
            const module = await import("./editor3d.js");
            module.initEditor3D();
          } else if (targetId === "character") {
            const module = await import("./editorPlayer.js");
            module.initCharacterEditor();
          } else if (targetId === "game") {
            const module = await import("./game.js");
            module.initGame();
          } else if (targetId === "exporter") {
            const module = await import("./export.js");
            module.initExportTab();
          } else if (targetId === "creator") {
            initProjectManager();
          }

          page.dataset.initialized = "true";
        } catch (err) {
          const { showError } = await import("./errorMessage.js");
          showError("Ошибка загрузки вкладки: " + err.message);
        }
      });
    });

    buttons[0].click();
  }

  // Менеджер проектов
  function initProjectManager() {
    const container = document.getElementById("creator");
    container.innerHTML = `
      <h2>🎮 Менеджер проектов</h2>
      <div class="toolbox">
        <input type="text" id="projectName" placeholder="Имя проекта" />
        <select id="projectType">
          <option value="2d">🧱 2D</option>
          <option value="3d">🧊 3D</option>
        </select>
        <button id="createProject">➕ Создать</button>
      </div>
      <div id="projectList"></div>
    `;

    const input = document.getElementById("projectName");
    const type = document.getElementById("projectType");
    const list = document.getElementById("projectList");

    function loadProjects() {
      const projects = JSON.parse(localStorage.getItem("ShitOS_projects") || "[]");
      list.innerHTML = "";

      if (projects.length === 0) {
        list.innerHTML = "<p>Нет проектов</p>";
        return;
      }

      projects.forEach((proj, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <b>${proj.name}</b> — ${proj.type.toUpperCase()} 
          <small>${proj.date}</small>
          <button data-i="${i}" class="load">📂</button>
          <button data-i="${i}" class="del">🗑</button>
        `;
        list.appendChild(div);
      });

      list.querySelectorAll(".del").forEach((btn) =>
        btn.addEventListener("click", () => {
          const i = btn.dataset.i;
          const projects = JSON.parse(localStorage.getItem("ShitOS_projects") || "[]");
          projects.splice(i, 1);
          localStorage.setItem("ShitOS_projects", JSON.stringify(projects));
          loadProjects();
        })
      );

      list.querySelectorAll(".load").forEach((btn) =>
        btn.addEventListener("click", () => {
          const i = btn.dataset.i;
          const projects = JSON.parse(localStorage.getItem("ShitOS_projects") || "[]");
          const proj = projects[i];
          alert(`Открытие проекта "${proj.name}" (${proj.type.toUpperCase()}) — функция позже`);
        })
      );
    }

    document.getElementById("createProject").addEventListener("click", () => {
      const name = input.value.trim();
      const t = type.value;
      if (!name) return alert("Введите имя проекта");

      const newProject = {
        name,
        type: t,
        date: new Date().toLocaleString()
      };

      const projects = JSON.parse(localStorage.getItem("ShitOS_projects") || "[]");
      projects.push(newProject);
      localStorage.setItem("ShitOS_projects", JSON.stringify(projects));
      input.value = "";
      loadProjects();
    });

    loadProjects();
  }
});
