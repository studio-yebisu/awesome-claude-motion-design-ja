import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Plate 02 — Monolith Field. 360 instanced columns ride a converging wave,
// lock into the catalog's 31 glyph, then release outward back into the wave.
// The camera only dollies along one fixed heading: in, hold, return.

const COLS = 24;
const ROWS = 15;
const COUNT = COLS * ROWS;
const PAPER = '#f2efe8';
const STONE = '#e7e1d5';
const ACCENT = '#2a43e8';
const OMEGA = Math.PI / 2; // two full wave cycles in 8 s, so frame 0 and frame 240 match
const GLYPH_H = 2.6;
const FLOOR_H = 0.28;
const FAR = 44;
const NEAR = 31;
const ELEVATION = THREE.MathUtils.degToRad(42);

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOutSine = (x) => 0.5 - 0.5 * Math.cos(Math.PI * x);
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutBack = (x) => {
  const c1 = 1.35;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// Draws a bold 3 and 1 with canvas paths (no font, no texture) and returns
// per-cell coverage in 0..1. Row 0 is the far edge of the field.
function sampleGlyph31(cols, rows) {
  const S = 20;
  const canvas = document.createElement('canvas');
  canvas.width = cols * S;
  canvas.height = rows * S;
  const g = canvas.getContext('2d', { willReadFrequently: true });
  const u = (v) => v * S;
  const deg = Math.PI / 180;
  const bowlX = 8.65;
  const stem = 17.75;

  g.fillStyle = '#000';
  g.strokeStyle = '#000';
  g.lineCap = 'butt';

  // 3: upper bowl, lower bowl, and a short waist tongue.
  g.lineWidth = u(2.4);
  g.beginPath();
  g.arc(u(bowlX), u(5.0), u(2.4), 200 * deg, 450 * deg);
  g.stroke();
  g.beginPath();
  g.arc(u(bowlX), u(9.9), u(2.7), 270 * deg, 520 * deg);
  g.stroke();
  g.fillRect(u(bowlX - 1.4), u(6.2), u(1.6), u(2.2));

  // 1: stem and flag.
  g.fillRect(u(stem - 1.2), u(1.4), u(2.4), u(12.4));
  g.lineWidth = u(2.2);
  g.beginPath();
  g.moveTo(u(stem - 0.2), u(1.9));
  g.lineTo(u(stem - 3.0), u(4.3));
  g.stroke();

  const data = g.getImageData(0, 0, canvas.width, canvas.height).data;
  const coverage = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sum = 0;
      let n = 0;
      for (let y = 1; y < S; y += 2) {
        for (let x = 1; x < S; x += 2) {
          sum += data[((r * S + y) * canvas.width + (c * S + x)) * 4 + 3];
          n++;
        }
      }
      coverage[r * cols + c] = sum / (n * 255);
    }
  }
  return coverage;
}

const css = `
.mf-canvas { position: absolute; left: 0; top: 0; }
.mf-ui { position: absolute; inset: 0; pointer-events: none; color: #16140f; font-family: 'Inter Tight', sans-serif; }
.mf-mono { font-family: 'JetBrains Mono', monospace; font-size: 20px; line-height: 24px; letter-spacing: 0.04em; text-transform: uppercase; }
.mf-kicker { position: absolute; left: 40px; top: 58px; color: #6b655a; }
.mf-title { position: absolute; left: 37px; top: 84px; font-size: 64px; line-height: 64px; font-weight: 700; letter-spacing: -0.035em; white-space: nowrap; }
.mf-status { position: absolute; right: 40px; top: 58px; display: flex; align-items: center; gap: 10px; }
.mf-dot { width: 12px; height: 12px; border-radius: 50%; background: ${ACCENT}; }
.mf-note { position: absolute; right: 40px; top: 88px; color: #6b655a; }
`;

export async function create(ctx) {
  const { root, width, height, fps } = ctx;
  root.innerHTML = '';

  const style = document.createElement('style');
  style.textContent = css;
  root.appendChild(style);

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(PAPER, 1);
  renderer.domElement.className = 'mf-canvas';
  root.appendChild(renderer.domElement);

  const ui = document.createElement('div');
  ui.className = 'mf-ui';
  ui.innerHTML = `
    <div class='mf-kicker mf-mono'>Plate 02 / Instanced</div>
    <div class='mf-title'>Monolith Field</div>
    <div class='mf-status mf-mono'><span class='mf-dot'></span><span class='mf-phase'>Wave</span></div>
    <div class='mf-note mf-mono'>360 columns · one draw call</div>
  `;
  root.appendChild(ui);
  const phaseEl = ui.querySelector('.mf-phase');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAPER);

  // Procedural studio reflections: RoomEnvironment prefiltered through PMREM, no HDR file.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = 0.85;
  if (typeof room.dispose === 'function') room.dispose();
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(30, width / height, 0.5, 200);
  // Shift the image down so the field sits under the title band (y 55..150).
  camera.setViewOffset(width, height, 0, -40, width, height);
  const target = new THREE.Vector3(0, 1.0, 0);
  const heading = new THREE.Vector3(0, Math.sin(ELEVATION), Math.cos(ELEVATION));

  const sun = new THREE.DirectionalLight(0xffffff, 1.7);
  sun.position.set(-10, 20, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -17;
  sun.shadow.camera.right = 17;
  sun.shadow.camera.top = 14;
  sun.shadow.camera.bottom = -14;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 60;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.ShadowMaterial({ color: 0x3a3226, opacity: 0.16 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const geometry = new THREE.BoxGeometry(0.84, 1, 0.84);
  geometry.translate(0, 0.5, 0); // base on the ground, so scale.y is column height
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.38,
    metalness: 0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.22,
    specularIntensity: 0.7,
    ior: 1.5,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  scene.add(mesh);

  const coverage = sampleGlyph31(COLS, ROWS);
  const cells = [];
  let dMax = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c - (COLS - 1) / 2;
      const z = r - (ROWS - 1) / 2;
      const d = Math.hypot(x, z * 1.25);
      dMax = Math.max(dMax, d);
      cells.push({ x, z, d, cov: coverage[r * COLS + c] });
    }
  }

  const dummy = new THREE.Object3D();
  const stone = new THREE.Color(STONE);
  const accent = new THREE.Color(ACCENT);
  const tint = new THREE.Color();

  // Every value is a pure function of t: seeking never depends on previous frames.
  const fieldAt = (t) => {
    for (let i = 0; i < COUNT; i++) {
      const cell = cells[i];
      // Phase moves toward the centre: the wave converges.
      const wave = 0.66 + 0.34 * Math.sin(0.78 * cell.d + OMEGA * t) + 0.1 * Math.sin(0.55 * cell.x - 2 * OMEGA * t);
      const glyph = FLOOR_H + cell.cov * (GLYPH_H - FLOOR_H);
      // Edges lock first as the wave arrives; release starts at the centre and runs outward.
      const up = clamp01((t - (0.8 + (dMax - cell.d) * 0.085)) / 0.85);
      const down = clamp01((t - (5.0 + cell.d * 0.075)) / 0.9);
      const lock = easeOutBack(up) * (1 - easeInOutCubic(down));
      const h = Math.max(0.08, wave + (glyph - wave) * lock);

      dummy.position.set(cell.x, 0, cell.z);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tint.copy(stone).lerp(accent, cell.cov * clamp01(lock));
      mesh.setColorAt(i, tint);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  // Camera movement entry 08: dolly in along a fixed heading, hold, return. No orbit, no yaw.
  const cameraAt = (t) => {
    const pushIn = easeInOutSine(clamp01((t - 0.5) / 2.8));
    const pullOut = easeInOutSine(clamp01((t - 5.1) / 2.5));
    const d = THREE.MathUtils.lerp(FAR, NEAR, pushIn * (1 - pullOut));
    camera.position.copy(target).addScaledVector(heading, d);
    camera.lookAt(target);
  };

  const phaseAt = (t) => {
    if (t < 0.8) return 'Wave';
    if (t < 2.9) return 'Converge';
    if (t < 5.0) return 'Hold · 31';
    if (t < 7.0) return 'Release';
    return 'Wave';
  };

  const render = (frame) => {
    const t = frame / fps;
    fieldAt(t);
    cameraAt(t);
    phaseEl.textContent = phaseAt(t);
    renderer.render(scene, camera);
  };

  render(0);
  if (mesh.instanceColor) mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
  if (document.fonts) await document.fonts.ready;

  return {
    seek: async (frame) => {
      render(Math.max(0, frame));
    },
    feature: 'InstancedMesh (360) with per-instance matrix and color; MeshPhysicalMaterial clearcoat; RoomEnvironment via PMREMGenerator; NeutralToneMapping; PCF shadows; canvas-path glyph mask; dolly-only PerspectiveCamera',
  };
}
