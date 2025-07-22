// loader.js — импорт файлов в редактор (gis, xod, gap)

import JSZip from "https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm";
import { showError } from "./errorMessage.js";

export function loadGisFile(file, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.grid) {
        showError("Некорректный .gis файл");
        return;
      }
      localStorage.setItem("ShitOS_map", JSON.stringify(data));
      alert("Карта .gis загружена!");
      if (callback) callback();
    } catch (e) {
      showError("Ошибка чтения .gis: " + e.message);
    }
  };
  reader.readAsText(file);
}

export function loadXodFile(file, callback) {
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const zip = await JSZip.loadAsync(reader.result);
      const keys = {
        "map.gis": "ShitOS_map",
        "character.gpd": "ShitOS_character",
        "scene.pis": "ShitOS_pis",
        "model.gfm": "ShitOS_gfm"
      };

      for (const entry in keys) {
        if (zip.file(entry)) {
          const content = await zip.file(entry).async("string");
          localStorage.setItem(keys[entry], content);
        }
      }

      alert("Архив .xod успешно импортирован!");
      if (callback) callback();
    } catch (e) {
      showError("Ошибка чтения .xod: " + e.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

export function loadGapFile(file, callback) {
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const zip = await JSZip.loadAsync(reader.result);

      const map = await zip.file("map.gis")?.async("string");
      const char = await zip.file("character.gpd")?.async("string");
      const meta = await zip.file("meta.json")?.async("string");
      const preview = await zip.file("preview.png")?.async("base64");

      if (map) localStorage.setItem("ShitOS_map", map);
      if (char) localStorage.setItem("ShitOS_character", char);
      if (meta) localStorage.setItem("ShitOS_meta", meta);
      if (preview) localStorage.setItem("ShitOS_preview", "data:image/png;base64," + preview);

      alert("Файл .gap успешно загружен");
      if (callback) callback();
    } catch (e) {
      showError("Ошибка загрузки .gap: " + e.message);
    }
  };
  reader.readAsArrayBuffer(file);
}
