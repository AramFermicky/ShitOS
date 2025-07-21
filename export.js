// js/export.js

const container = document.getElementById('export');
if (!container.dataset.initialized) {
  container.dataset.initialized = 'true';
  container.innerHTML = `
    <h2>📤 Экспорт проекта</h2>
    <p>Выберите формат:</p>
    <button id="exportGis">.gis</button>
    <button id="exportPis">.pis</button>
    <button id="exportGfm">.gfm</button>
  `;

  document.getElementById('exportGis').onclick = () => alert('Экспорт в .gis пока не реализован');
  document.getElementById('exportPis').onclick = () => alert('Экспорт в .pis пока не реализован');
  document.getElementById('exportGfm').onclick = () => alert('Экспорт в .gfm пока не реализован');
}
