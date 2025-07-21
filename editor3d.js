// js/editor3d.js

export function initEditor3D() {
  const container = document.getElementById("editor3d");
  container.innerHTML = `
    <h2>🔷 Редактор 3D</h2>
    <div class="toolbox">
      <button id="savePIS">💾 Сохранить .pis</button>
      <button id="exportGFM">📦 Экспорт .gfm</button>
    </div>
    <div id="threeContainer" style="width:100%; height:500px; border:1px solid #333;"></div>
  `;

  // Three.js CDN
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.min.js";
  script.onload = () => setup3D(container);
  document.head.appendChild(script);
}

function setup3D(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101010);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / 500, 0.1, 1000);
  camera.position.set(5, 10, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, 500);
  document.getElementById("threeContainer").appendChild(renderer.domElement);

  const controlsScript = document.createElement("script");
  controlsScript.src = "https://cdn.jsdelivr.net/npm/three@0.154.0/examples/js/controls/OrbitControls.min.js";
  controlsScript.onload = () => {
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
    animate();
  };
  document.head.appendChild(controlsScript);

  // Освещение
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  // Сетка
  const grid = new THREE.GridHelper(10, 10);
  scene.add(grid);

  // Объекты
  const cubes = [];

  // Добавление по клику
  renderer.domElement.addEventListener("click", (event) => {
    const bounds = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersect);

    const x = Math.round(intersect.x);
    const z = Math.round(intersect.z);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, 0.5, z);
    scene.add(cube);
    cubes.push({ x, y: 0.5, z });
  });

  // Экспорт .pis
  document.getElementById("savePIS").onclick = () => {
    const blob = new Blob([JSON.stringify(cubes, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "scene.pis";
    a.click();
  };

  // Экспорт .gfm (только координаты)
  document.getElementById("exportGFM").onclick = () => {
    const gfm = {
      objects: cubes.map(c => ({ type: "cube", position: c }))
    };
    const blob = new Blob([JSON.stringify(gfm, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "scene.gfm";
    a.click();
  };

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
}
