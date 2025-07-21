// js/loader.js

export function loadGISFile(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const json = JSON.parse(e.target.result);
      callback(json);
    } catch (err) {
      alert("Ошибка загрузки файла .gis: " + err.message);
    }
  };
  reader.readAsText(file);
}
