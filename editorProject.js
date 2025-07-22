// editorProject.js — менеджер проектов ShitOS

export function initProjectManager() {
  const container = document.getElementById("projects");
  container.innerHTML = `
    <h2>📁 Менеджер проектов</h2>
    <div>
      <input id="newProjectName" placeholder="Название проекта" />
      <button id="createProject">➕ Новый проект</button>
    </div>
    <ul id="projectList"></ul>
  `;

  const list = document.getElementById("projectList");

  function renderProjects() {
    const all = JSON.parse(localStorage.getItem("ShitOS_projects") || "[]");
    list.innerHTML = "";
    all.forEach((proj, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <b>${proj.name}</b>
        <button data-idx="${idx}" class="load">📂</button>
        <button data-idx="${idx}" class="delete">❌</button>
      `;
      list.appendChild(li);
    });

    list.querySelectorAll(".load").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        const project = JSON.parse(localStorage.getItem("ShitOS_projects"))[idx];
        localStorage.setItem("ShitOS_map", JSON.stringify(project.data));
        alert("Проект загружен в редактор!");
      };
    });

    list.querySelectorAll(".delete").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        let all = JSON.parse(localStorage.getItem("ShitOS_projects"));
        all.splice(idx, 1);
        localStorage.setItem("ShitOS_projects", JSON.stringify(all));
        renderProjects();
      };
    });
  }

  document.getElementById("createProject").onclick = () => {
    const name = document.getElementById("newProjectName").value.trim();
    if (!name) return alert("Укажите название проекта");
    const current = localStorage.getItem("ShitOS_map");
    if (!current) return alert("Нет текущей карты для сохранения");

    const projects = JSON.parse(localStorage.getItem("ShitOS_projects") || "[]");
    projects.push({ name, data: JSON.parse(current) });
    localStorage.setItem("ShitOS_projects", JSON.stringify(projects));
    renderProjects();
  };

  renderProjects();
}
