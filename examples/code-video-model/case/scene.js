import * as THREE from 'three';

// EDIT HERE: colors, obstacle heights, route points, and the camera are independent.
// Route coordinates are [x, z]. The scene is a code-video input, not an H3 output.
export const CONFIG = {
  width: 960,
  height: 544,
  fps: 24,
  frames: 124,
  colors: {
    background: '#e7e7df',
    platform: '#f5f2e9',
    road: '#455c60',
    route: '#f0c179',
    traveled: '#92d8c4',
    rover: '#cf7151',
    cargo: '#eee4cf',
    tire: '#273b40',
    obstacle: '#9dada5',
    lettering: '#334d50',
  },
  route: [
    [-4.8, 1.5], [-3.4, 1.5], [-1.8, -1.25],
    [0, 0], [1.8, 1.25], [3.4, -1.5], [4.8, -1.5],
  ],
  roadWidth: 1.45,
  obstacles: [
    { x: -3.6, z: -1.1, width: 1.15, depth: 1.0, height: 1.25 },
    { x: -0.65, z: 2.4, width: 0.85, depth: 0.85, height: 0.75 },
    { x: 0.65, z: -2.4, width: 0.85, depth: 0.85, height: 0.95 },
    { x: 3.6, z: 1.1, width: 1.15, depth: 1.0, height: 1.5 },
  ],
  camera: { position: [7.1, 11.3, 14.7], target: [0, 0, 0], fov: 37 },
};

const endTime = (CONFIG.frames - 1) / CONFIG.fps;
const scene = new THREE.Scene();
scene.background = new THREE.Color(CONFIG.colors.background);
const camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, CONFIG.width / CONFIG.height, 0.1, 80);
camera.position.fromArray(CONFIG.camera.position);
camera.lookAt(...CONFIG.camera.target);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(CONFIG.width, CONFIG.height);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.domElement.setAttribute('aria-label', 'A delivery rover follows a coded S-shaped route around four obstacles.');
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x657b78, 2.3));
const sun = new THREE.DirectionalLight(0xfff4dc, 3.4);
sun.position.set(-5, 12, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 8, bottom: -8, near: 1, far: 35 });
sun.shadow.normalBias = 0.025;
scene.add(sun);

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...options });
}
function box(parent, width, height, depth, color, position, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material(color, options));
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function disk(parent, radius, color, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 48), material(color));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function flatLabel(text, width, height, x, z) {
  // This canvas is a texture source only and is never inserted into the DOM.
  const source = document.createElement('canvas');
  source.width = 1024;
  source.height = 128;
  const context = source.getContext('2d');
  context.fillStyle = CONFIG.colors.lettering;
  context.font = '600 62px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 512, 66);
  const texture = new THREE.CanvasTexture(source);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.025, z);
  scene.add(mesh);
}

box(scene, 13.5, 0.28, 8.6, CONFIG.colors.platform, [0, -0.16, 0]);
box(scene, 200, 0.1, 200, CONFIG.colors.background, [0, -0.38, 0]);
flatLabel('CODE / ROUTE / CAMERA', 5.5, 0.68, -2.5, -3.65);
flatLabel('DELIVERY 01', 3.0, 0.55, 3.5, 3.65);

const route = new THREE.CatmullRomCurve3(CONFIG.route.map(([x, z]) => new THREE.Vector3(x, 0.07, z)), false, 'centripetal');
route.arcLengthDivisions = 600;
route.updateArcLengths();
const segments = 240;
const roadPositions = [];
const roadIndices = [];
const centerPoints = [];
for (let i = 0; i <= segments; i++) {
  const u = i / segments;
  const point = route.getPointAt(u);
  const tangent = route.getTangentAt(u);
  const side = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(CONFIG.roadWidth / 2);
  roadPositions.push(point.x + side.x, point.y, point.z + side.z, point.x - side.x, point.y, point.z - side.z);
  centerPoints.push(new THREE.Vector3(point.x, point.y + 0.018, point.z));
  if (i < segments) {
    const a = i * 2;
    roadIndices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
}
const roadGeometry = new THREE.BufferGeometry();
roadGeometry.setAttribute('position', new THREE.Float32BufferAttribute(roadPositions, 3));
roadGeometry.setIndex(roadIndices);
roadGeometry.computeVertexNormals();
const road = new THREE.Mesh(roadGeometry, material(CONFIG.colors.road, { side: THREE.DoubleSide }));
road.receiveShadow = true;
scene.add(road);

// A continuous thin centerline and a thicker completed segment reveal the route.
const centerCurve = new THREE.CatmullRomCurve3(centerPoints);
const guideLine = new THREE.Mesh(new THREE.TubeGeometry(centerCurve, segments, 0.022, 5, false), material(CONFIG.colors.route));
scene.add(guideLine);
const traveledGeometry = new THREE.TubeGeometry(centerCurve, segments, 0.036, 6, false);
const traveled = new THREE.Mesh(traveledGeometry, material(CONFIG.colors.traveled));
traveled.position.y = 0.006;
scene.add(traveled);

const start = route.getPointAt(0);
const finish = route.getPointAt(1);
disk(scene, 0.56, CONFIG.colors.traveled, start.x, 0.092, start.z);
disk(scene, 0.56, CONFIG.colors.route, finish.x, 0.092, finish.z);
disk(scene, 0.38, CONFIG.colors.road, finish.x, 0.094, finish.z);

CONFIG.obstacles.forEach(({ x, z, width, depth, height }) => {
  box(scene, width + 0.2, 0.07, depth + 0.2, '#d0d7ca', [x, 0.035, z]);
  box(scene, width, height, depth, CONFIG.colors.obstacle, [x, 0.07 + height / 2, z]);
  box(scene, width * 0.75, 0.025, depth * 0.75, '#c7d1bf', [x, 0.083 + height, z]);
});

const rover = new THREE.Group();
scene.add(rover);
box(rover, 0.9, 0.25, 1.15, CONFIG.colors.rover, [0, 0.44, 0]);
box(rover, 0.82, 0.08, 1.18, CONFIG.colors.tire, [0, 0.3, 0]);
box(rover, 0.66, 0.49, 0.67, CONFIG.colors.cargo, [0, 0.8, -0.15]);
box(rover, 0.085, 0.015, 0.69, '#d1aa79', [0, 1.052, -0.15]);
box(rover, 0.43, 0.14, 0.08, '#294b53', [0, 0.61, 0.49]);
box(rover, 0.64, 0.07, 0.04, '#f6e7b1', [0, 0.44, 0.59], { emissive: '#e1cc8e', emissiveIntensity: 0.15 });
const sensor = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.11, 20), material(CONFIG.colors.tire));
sensor.position.set(0, 0.64, 0.22);
sensor.castShadow = true;
rover.add(sensor);

const wheelRadius = 0.225;
const wheels = [];
for (const x of [-0.49, 0.49]) {
  for (const z of [-0.38, 0.38]) {
    const wheel = new THREE.Group();
    wheel.position.set(x, wheelRadius, z);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.17, 24), material(CONFIG.colors.tire));
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheel.add(tire);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.183, 20), material('#b4c1b6'));
    hub.rotation.z = Math.PI / 2;
    wheel.add(hub);
    // Small radial mark makes distance-based wheel rotation visible.
    box(wheel, 0.19, 0.04, 0.14, CONFIG.colors.cargo, [0, 0.065, 0]);
    rover.add(wheel);
    wheels.push(wheel);
  }
}

function renderAt(seconds) {
  const t = THREE.MathUtils.clamp(Number.isFinite(seconds) ? seconds : 0, 0, endTime);
  const normalized = t / endTime;
  // Smooth departure and arrival; every state is derived from the requested time.
  const u = normalized * normalized * (3 - 2 * normalized);
  const position = route.getPointAt(u);
  const tangent = route.getTangentAt(u);
  rover.position.set(position.x, 0.087, position.z);
  rover.rotation.set(0, Math.atan2(tangent.x, tangent.z), 0);
  const roll = u * route.getLength() / wheelRadius;
  wheels.forEach(wheel => { wheel.rotation.x = roll; });
  traveledGeometry.setDrawRange(0, Math.floor(u * segments) * 6 * 6);
  // Explicitly restore camera state too: out-of-order seeks never accumulate deltas.
  camera.position.fromArray(CONFIG.camera.position);
  camera.lookAt(...CONFIG.camera.target);
  camera.updateMatrixWorld(true);
  scene.updateMatrixWorld(true);
  renderer.render(scene, camera);
}

// No timers, animation loop, random state, external assets, or network requests.
window.reconstruction = {
  pause() {},
  async seek(seconds) { renderAt(seconds); },
  getCameraState() {
    return {
      position: camera.position.toArray(),
      quaternion: camera.quaternion.toArray(),
      fov: camera.fov,
    };
  },
};
await window.reconstruction.seek(0);
