// blockbench.js — встроенный редактор моделей через iframe

export function initBlockbench() {
  const container = document.getElementById("projects");
  container.innerHTML = `
    <h2>🧱 3D Редактор моделей (Blockbench Web)</h2>
    <iframe src="https://web.blockbench.net/" width="100%" height="600px" style="border:1px solid #ccc; border-radius:8px;"></iframe>
    <p style="margin-top: 10px;">
      🛈 Модели можно экспортировать из Blockbench в <code>.gltf</code>, <code>.json</code> или <code>.bbmodel</code> и сохранить вручную.<br>
      После этого их можно использовать в 3D-редакторе ShitOS.
    </p>
  `;
}
