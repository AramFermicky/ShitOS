// editor3d.js — расширенный 3D-редактор на THREE.js с экспортом и импортом

export function initEditor3D() {
  const container = document.getElementById("editor3d");
  container.innerHTML = `
    <h2>🧊 3D Редактор</h2>
    <div id="threeContainer" style="width:100%; height:512px;"></div>
    <div class="toolbox">
      <button id="addCube">➕ Куб</button>
      <button id="importScene">📂 Импорт .pis / .gfm</button>
      <button id="exportPIS">💾 Экспорт .pis</button>
      <button id="exportGFM">📦 Экспорт .gfm</button>
    </div>
  `;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.aspect = 512 / 512;
  camera.updateProjectionMatrix();
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(512, 512);
  document.getElementById("threeContainer").appendChild(renderer.domElement);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);

  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x3399ff });

  const blocks = [];

  function addBlock(x = 0, y = 0.5, z = 0) {
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x, y, z);
    scene.add(cube);
    blocks.push({ x, y, z });
  }

  document.getElementById("addCube").onclick = () => addBlock();

  document.getElementById("exportPIS").onclick = () => {
    const data = { project: "3DScene", blocks };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.pis";
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById("exportGFM").onclick = () => {
    const blob = new Blob([JSON.stringify(blocks)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "model.gfm";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 📂 Импорт файлов .pis и .gfm
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".pis,.gfm";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  document.getElementById("importScene").onclick = () => fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const imported = data.blocks || data;
        imported.forEach(obj => addBlock(obj.x, obj.y, obj.z));
        alert("Импорт завершён!");
      } catch (e) {
        alert("Ошибка импорта: " + e.message);
      }
    };
    reader.readAsText(file);
  };

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}
