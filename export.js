// export.js — экспорт данных из редактора в .gis, .gap, .xod и прочее

import JSZip from "https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm";
import { showError } from "./errorMessage.js";
import { loadGisFile, loadXodFile, loadGapFile } from "./loader.js";

export function initExport() {
  const container = document.getElementById("exporter");
  container.innerHTML = `
    <h2>📦 Экспорт проекта</h2>
    <div class="toolbox">
      <button id="exportGIS">💾 .gis (2D уровень)</button>
      <button id="exportGPD">🧍 .gpd (персонаж)</button>
      <button id="exportPIS">🔲 .pis (3D-проект)</button>
      <button id="exportGFM">🧱 .gfm (3D-модели)</button>
      <button id="exportGAP">▶️ .gap (игровой билд)</button>
      <button id="exportXOD">📁 .xod (архив проекта)</button>
    </div>

    <hr />
    <h3>📥 Импорт проекта</h3>
    <div class="toolbox">
      <input type="file" id="importGIS" accept=".gis" />
      <input type="file" id="importGAP" accept=".gap" />
      <input type="file" id="importXOD" accept=".xod" />
    </div>
  `;

  const exportFile = (data, filename, type = "application/json") => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById("exportGIS").onclick = () => {
    const map = localStorage.getItem("ShitOS_map");
    if (!map) return showError("Нет карты");
    exportFile(JSON.parse(map), "map.gis");
  };

  document.getElementById("exportGPD").onclick = () => {
    const char = localStorage.getItem("ShitOS_character");
    if (!char) return showError("Нет персонажа");
    exportFile(JSON.parse(char), "character.gpd");
  };

  document.getElementById("exportPIS").onclick = () => {
    const pis = localStorage.getItem("ShitOS_pis");
    if (!pis) return showError("Нет 3D-проекта");
    exportFile(JSON.parse(pis), "scene.pis");
  };

  document.getElementById("exportGFM").onclick = () => {
    const gfm = localStorage.getItem("ShitOS_gfm");
    if (!gfm) return showError("Нет 3D-моделей");
    exportFile(JSON.parse(gfm), "model.gfm");
  };

  document.getElementById("exportGAP").onclick = async () => {
    const map = localStorage.getItem("ShitOS_map");
    const char = localStorage.getItem("ShitOS_character");

    if (!map || !char) return showError("Нужна карта и персонаж");

    const zip = new JSZip();
    zip.file("map.gis", map);
    zip.file("character.gpd", char);
    zip.file("meta.json", JSON.stringify({
      title: "ShitOS Game",
      version: "1.0",
      createdAt: new Date().toISOString()
    }, null, 2));

    const preview = localStorage.getItem("ShitOS_preview");
    if (preview) {
      const response = await fetch(preview);
      const blob = await response.blob();
      zip.file("preview.png", blob);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "game.gap";
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById("exportXOD").onclick = async () => {
    const zip = new JSZip();

    const add = (name, key) => {
      const item = localStorage.getItem(key);
      if (item) zip.file(name, item);
    };

    add("map.gis", "ShitOS_map");
    add("character.gpd", "ShitOS_character");
    add("scene.pis", "ShitOS_pis");
    add("model.gfm", "ShitOS_gfm");

    const meta = {
      projectName: "ShitOS Game Project",
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    zip.file("meta.json", JSON.stringify(meta, null, 2));

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.xod";
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById("importGIS").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) loadGisFile(file, () => alert("Карта импортирована"));
  });

  document.getElementById("importGAP").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) loadGapFile(file, () => alert("Билд игры загружен"));
  });

  document.getElementById("importXOD").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) loadXodFile(file, () => alert("Проект загружен"));
  });
}
