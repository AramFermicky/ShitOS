// js/editor3d.js

import { showError } from "./errorMessage.js";

export function initEditor3D() {
  const container = document.getElementById("editor3d");
  container.innerHTML = `
    <h2>🟊 Редактор 3D-сцены</h2>
    <div class="toolbox">
      <button id="addCube">➕ Куб</button>
      <button id="exportPis">💾 Сохранить .pis</button>
      <button id="exportGfm">💾 Экспорт .gfm</button>
      <input type="file" id="importPis" accept=".pis" />
      <input type="file" id="importGfm" accept=".gfm" />
    </div>
    <canvas id="threeCanvas" style="width:100%;height:400px;"></canvas>
  `;

  const canvas = document.getElementById("threeCanvas");

  // three.js setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / 400, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, 400);
  camera.position.z = 5;

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const objects = [];

  document.getElementById("addCube").onclick = () => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(Math.random() * 4 - 2, 0, Math.random() * 4 - 2);
    scene.add(cube);
    objects.push({ type: "cube", position: cube.position.toArray(), color: material.color.getHex() });
  };

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  document.getElementById("exportPis").onclick = () => {
    const blob = new Blob([JSON.stringify(objects, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "scene.pis";
    a.click();
    localStorage.setItem("ShitOS_scene.pis", JSON.stringify(objects));
  };

  document.getElementById("exportGfm").onclick = () => {
    const gfmData = { version: 1, models: objects };
    const blob = new Blob([JSON.stringify(gfmData)], { type: "application/gfm" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "scene.gfm";
    a.click();
    localStorage.setItem("ShitOS_scene.gfm", JSON.stringify(gfmData));
  };

  document.getElementById("importPis").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        data.forEach(obj => {
          if (obj.type === "cube") {
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshStandardMaterial({ color: obj.color });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(...obj.position);
            scene.add(cube);
          }
        });
        objects.splice(0, objects.length, ...data);
        localStorage.setItem("ShitOS_scene.pis", JSON.stringify(data));
      } catch (err) {
        showError("Ошибка импорта .pis: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  document.getElementById("importGfm").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.models) throw new Error("Неверный формат .gfm");
        data.models.forEach(obj => {
          if (obj.type === "cube") {
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshStandardMaterial({ color: obj.color });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(...obj.position);
            scene.add(cube);
          }
        });
        objects.splice(0, objects.length, ...data.models);
        localStorage.setItem("ShitOS_scene.gfm", JSON.stringify(data));
      } catch (err) {
        showError("Ошибка импорта .gfm: " + err.message);
      }
    };
    reader.readAsText(file);
  });
}
