// editor3d.js — базовый 3D-редактор с загрузкой модели из GFM

import * as THREE from "https://cdn.skypack.dev/three@0.152.2";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

export function initEditor3D() {
  const container = document.getElementById("projects");
  container.innerHTML = `
  <h2>🔲 3D-редактор</h2>
  <div style="margin-bottom:8px;">
    Слой (Y): 
    <button id="yDown">-</button>
    <span id="currentY">0</span>
    <button id="yUp">+</button>
    <button id="savePis">💾 Сохранить .pis</button>
    <button id="loadPis">📥 Загрузить .pis</button>
  </div>
  <div id="editor3dArea" style="width:100%;height:600px;border:1px solid #555;border-radius:8px;"></div>
`;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / 600, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.offsetWidth, 600);
  document.getElementById("editor3dArea").appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  camera.position.set(5, 8, 10);
  controls.update();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  const gridHelper = new THREE.GridHelper(20, 20);
  scene.add(gridHelper);
  let currentY = 0;
  document.getElementById("currentY").innerText = currentY;

  document.getElementById("yUp").onclick = () => {
  currentY++;
  document.getElementById("currentY").innerText = currentY;
};
  document.getElementById("yDown").onclick = () => {
  currentY--;
  document.getElementById("currentY").innerText = currentY;
};

  // ===== MODEL: from GFM =====
  const rawModel = localStorage.getItem("ShitOS_gfm");
  if (!rawModel) {
    const warn = document.createElement("p");
    warn.innerHTML = ⚠️ Модель не загружена. Импортируй через вкладку <b>📥 Импорт GFM</b>.";
    container.appendChild(warn);
    return;
  }

  let modelMesh;
  try {
    const gfm = JSON.parse(rawModel);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    if (gfm.color) {
      material.color = new THREE.Color(gfm.color);
    }

    modelMesh = new THREE.Mesh(geometry, material);
    modelMesh.position.set(0, 0.5, 0);
    scene.add(modelMesh);
  } catch (e) {
    alert("❌ Ошибка загрузки модели GFM: " + e.message);
    return;
  }

  // ===== Click to place copies =====
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const placed = [];

  function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(gridHelper, true);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const x = Math.floor(point.x);
      const y = 0.5;
      const z = Math.floor(point.z);

      const newMesh = modelMesh.clone();
      newMesh.position.set(x, y, z);
      scene.add(newMesh);
      placed.push(newMesh);
    }
  }

  renderer.domElement.addEventListener("click", onClick);
const placed = [];

  function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(gridHelper, true);

  if (intersects.length > 0) {
    const point = intersects[0].point;
    const x = Math.floor(point.x);
    const z = Math.floor(point.z);
    const y = currentY;

    const newMesh = modelMesh.clone();
    newMesh.position.set(x, y + 0.5, z);
    newMesh.userData = { x, y, z };
    scene.add(newMesh);
    placed.push(newMesh);
  }
}

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
document.getElementById("savePis").onclick = () => {
  const data = placed.map(obj => obj.userData);
  localStorage.setItem("ShitOS_pis", JSON.stringify(data));
  alert("✅ Сцена сохранена в ShitOS_pis");
};

document.getElementById("loadPis").onclick = () => {
  const raw = localStorage.getItem("ShitOS_pis");
  if (!raw) return alert("❌ Нет сохранённой сцены");

  try {
    const blocks = JSON.parse(raw);
    blocks.forEach(({ x, y, z }) => {
      const newMesh = modelMesh.clone();
      newMesh.position.set(x, y + 0.5, z);
      newMesh.userData = { x, y, z };
      scene.add(newMesh);
      placed.push(newMesh);
    });
    alert("✅ Сцена загружена");
  } catch (e) {
    alert("Ошибка загрузки .pis: " + e.message);
  }
};

