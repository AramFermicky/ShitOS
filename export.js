// js/export.js

import JSZip from "https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm";
import { showError } from "./errorMessage.js";

export function initExportTab() {
  const container = document.getElementById("exporter");
  container.innerHTML = `
    <h2>📦 Экспорт проекта</h2>
    <div class="toolbox">
      <label><input type="checkbox" id="exportMap" checked /> Карта (.gis)</label>
      <label><input type="checkbox" id="exportPlayer" checked /> Персонаж (.gis)</label>
      <label><input type="checkbox" id="export3D" checked /> 3D-сцена (.pis, .gfm)</label>
      <button id="doExport">💾 Экспорт .zip</button>
    </div>
    <p>После экспорта вы получите zip-архив с выбранными файлами проекта.</p>
  `;

  document.getElementById("doExport").addEventListener("click", async () => {
    const zip = new JSZip();

    const shouldMap = document.getElementById("exportMap").checked;
    const shouldPlayer = document.getElementById("exportPlayer").checked;
    const should3D = document.getElementById("export3D").checked;

    if (shouldMap) {
      const map = localStorage.getItem("ShitOS_map");
      if (map) zip.file("map.gis", map);
    }

    if (shouldPlayer) {
      const player = localStorage.getItem("ShitOS_player");
      if (player) zip.file("player.gis", player);
    }

    if (should3D) {
      const pis = localStorage.getItem("ShitOS_scene.pis");
      const gfm = localStorage.getItem("ShitOS_scene.gfm");

      if (pis) zip.file("scene.pis", pis);
      if (gfm) zip.file("scene.gfm", gfm);
    }

    try {
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "project.zip";
      a.click();
    } catch (err) {
      showError("Ошибка экспорта: " + err.message);
    }
  });
}
