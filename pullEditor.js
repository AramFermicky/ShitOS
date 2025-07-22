// pullEditor.js — сцепка сцен (порталы между .gis картами)

export function initPullEditor() {
  const container = document.getElementById("projects");
  container.innerHTML = `
    <h2>🔗 Связи сцен (порталы)</h2>
    <div class="toolbox">
      <label>Сцена-источник:
        <select id="linkFrom"></select>
      </label>
      <label>Координаты портала (X, Y):
        <input type="number" id="portalX" style="width:60px" />
        <input type="number" id="portalY" style="width:60px" />
      </label>
      <label>Сцена-назначение:
        <select id="linkTo"></select>
      </label>
      <button id="saveLink">💾 Добавить связь</button>
    </div>
    <h3>🧾 Все связи:</h3>
    <ul id="linkList"></ul>
  `;

  const fromSelect = document.getElementById("linkFrom");
  const toSelect = document.getElementById("linkTo");
  const linkList = document.getElementById("linkList");

  const savedProjects = JSON.parse(localStorage.getItem("ShitOS_projects") || "[]");
  const links = JSON.parse(localStorage.getItem("ShitOS_links") || "[]");

  savedProjects.forEach((p, idx) => {
    const opt1 = document.createElement("option");
    opt1.value = idx;
    opt1.textContent = p.name;
    fromSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = idx;
    opt2.textContent = p.name;
    toSelect.appendChild(opt2);
  });

  function renderLinks() {
    linkList.innerHTML = "";
    links.forEach((l, i) => {
      const li = document.createElement("li");
      li.innerHTML = `📍 <b>${savedProjects[l.from]?.name}</b> [${l.x},${l.y}] → <b>${savedProjects[l.to]?.name}</b>
        <button data-idx="${i}" class="delLink">❌</button>`;
      linkList.appendChild(li);
    });

    document.querySelectorAll(".delLink").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        links.splice(idx, 1);
        localStorage.setItem("ShitOS_links", JSON.stringify(links));
        renderLinks();
      };
    });
  }

  document.getElementById("saveLink").onclick = () => {
    const from = parseInt(fromSelect.value);
    const to = parseInt(toSelect.value);
    const x = parseInt(document.getElementById("portalX").value);
    const y = parseInt(document.getElementById("portalY").value);

    if (isNaN(from) || isNaN(to) || isNaN(x) || isNaN(y)) {
      alert("Заполни все поля");
      return;
    }

    links.push({ from, to, x, y });
    localStorage.setItem("ShitOS_links", JSON.stringify(links));
    renderLinks();
  };

  renderLinks();
}
