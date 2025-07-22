// gfmImporter.js — импорт моделей из .bbmodel, .gltf, .json в .gfm формат

export function initGfmImporter(containerId = "projects") {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <h2>📥 Импорт модели</h2>
    <p>Импортируй файл, экспортированный из Blockbench (.bbmodel, .gltf, .json):</p>
    <input type="file" id="importGFMModel" accept=".json,.gltf,.bbmodel" />
  `;

  document.getElementById("importGFMModel").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const model = JSON.parse(reader.result);
        localStorage.setItem("ShitOS_gfm", JSON.stringify(model));
        alert("Модель импортирована и сохранена как .gfm");
      } catch (err) {
        alert("❌ Ошибка при импорте: " + err.message);
      }
    };
    reader.readAsText(file);
  });
}
