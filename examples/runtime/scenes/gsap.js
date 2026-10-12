import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

// Plate 01 — Typeset. Sorts leave an alphabetised case, set two lines, hold for proof,
// then distribute home in reverse order, so frame 0 and frame 240 share one state.

const INK = '#16140f';
const MUTED = '#6b655a';
const ACCENT = '#e2462b';
const CASE_SCALE = 0.42;
const STEP = 0.05;
const BACK_STEP = 0.04;

const css = `
.ts-plate { position: absolute; inset: 0; color: ${INK}; font-family: 'Inter Tight', sans-serif; }
.ts-mono { font-family: 'JetBrains Mono', monospace; font-size: 20px; line-height: 24px; letter-spacing: 0.04em; text-transform: uppercase; }
.ts-tag { position: absolute; left: 40px; top: 58px; }
.ts-tag span { color: ${MUTED}; }
.ts-phases { position: absolute; right: 40px; top: 58px; display: flex; gap: 26px; }
.ts-phase { opacity: 0.38; }
.ts-phase-bar { position: absolute; left: 0; top: 30px; width: 10px; height: 3px; background: ${ACCENT}; }
.ts-line { position: absolute; left: 40px; font-size: 84px; line-height: 80px; font-weight: 700; letter-spacing: -0.035em; white-space: nowrap; }
.ts-stop { color: ${ACCENT}; }
.ts-mark { position: absolute; top: 286px; height: 6px; background: ${ACCENT}; }
.ts-rule { position: absolute; left: 40px; top: 298px; width: 880px; height: 2px; background: ${INK}; }
.ts-sub { position: absolute; left: 40px; top: 312px; width: 720px; font-size: 24px; line-height: 30px; font-weight: 500; color: #3f3a32; }
.ts-case-label { position: absolute; left: 40px; top: 380px; color: ${MUTED}; }
.ts-slot { position: absolute; border: 1.5px solid rgba(22, 20, 15, 0.2); border-radius: 3px; }
`;

export async function create(ctx) {
  const { root, width, fps } = ctx;
  root.innerHTML = '';

  const style = document.createElement('style');
  style.textContent = css;
  root.appendChild(style);

  const plate = document.createElement('div');
  plate.className = 'ts-plate';
  plate.innerHTML = `
    <div class='ts-tag ts-mono'>Plate 01 <span>/ Typeset</span></div>
    <div class='ts-phases ts-mono'>
      <div class='ts-phase'>Compose</div>
      <div class='ts-phase'>Proof</div>
      <div class='ts-phase'>Distribute</div>
      <div class='ts-phase-bar'></div>
    </div>
    <div class='ts-line' style='top: 112px'>Set every letter</div>
    <div class='ts-line' style='top: 192px'>in its place.</div>
    <div class='ts-mark'></div>
    <div class='ts-rule'></div>
    <div class='ts-sub'>Each sort is picked from the case, set on the line, proofed, then distributed home.</div>
    <div class='ts-case-label ts-mono'>Case · sorted a–z</div>
  `;
  root.appendChild(plate);

  // Split only after the real faces are in, otherwise char boxes are measured on fallback metrics.
  if (document.fonts) {
    await Promise.all([
      document.fonts.load(`700 84px 'Inter Tight'`),
      document.fonts.load(`500 24px 'Inter Tight'`),
      document.fonts.load(`400 20px 'JetBrains Mono'`),
    ]).catch(() => {});
    await document.fonts.ready;
  }

  const head = SplitText.create(plate.querySelectorAll('.ts-line'), {
    type: 'words,chars',
    wordsClass: 'ts-word',
    charsClass: 'ts-char',
  });
  const sub = SplitText.create(plate.querySelector('.ts-sub'), {
    type: 'lines',
    mask: 'lines',
    linesClass: 'ts-subline',
  });
  const chars = head.chars;
  chars.forEach((el) => {
    if (el.textContent === '.') el.classList.add('ts-stop');
  });

  const box = root.getBoundingClientRect();
  const k = box.width / width || 1;
  const local = (el) => {
    const r = el.getBoundingClientRect();
    return { x: (r.left - box.left) / k, y: (r.top - box.top) / k, w: r.width / k, h: r.height / k };
  };

  // Case: two rows of compartments. Sorts are filed alphabetically, so every flight path is a real pick.
  const cols = Math.ceil(chars.length / 2);
  const gap = 6;
  const slotW = (880 - gap * (cols - 1)) / cols;
  const slotH = 52;
  const slots = [];
  for (let s = 0; s < cols * 2; s++) {
    const x = 40 + (s % cols) * (slotW + gap);
    const y = 410 + Math.floor(s / cols) * (slotH + gap);
    const slot = document.createElement('div');
    slot.className = 'ts-slot';
    Object.assign(slot.style, { left: `${x}px`, top: `${y}px`, width: `${slotW}px`, height: `${slotH}px` });
    plate.insertBefore(slot, plate.firstChild);
    slots.push({ cx: x + slotW / 2, cy: y + slotH / 2 });
  }

  const ranked = chars
    .map((el, i) => ({ i, c: el.textContent.toLowerCase() }))
    .sort((a, b) => (a.c < b.c ? -1 : a.c > b.c ? 1 : a.i - b.i));
  const home = [];
  ranked.forEach((entry, rank) => {
    home[entry.i] = slots[rank];
  });
  const offs = chars.map((el, i) => {
    const r = local(el);
    return { dx: home[i].cx - (r.x + r.w / 2), dy: home[i].cy - (r.y + r.h / 2) };
  });

  const mark = plate.querySelector('.ts-mark');
  const word = head.words.find((w) => w.textContent.trim() === 'place.');
  if (word) {
    const wr = local(word);
    Object.assign(mark.style, { left: `${wr.x}px`, width: `${wr.w}px` });
  }
  const rule = plate.querySelector('.ts-rule');
  const phaseEls = Array.from(plate.querySelectorAll('.ts-phase'));
  const phaseBar = plate.querySelector('.ts-phase-bar');
  const phasePos = phaseEls.map((el) => ({ x: el.offsetLeft, w: el.offsetWidth }));

  // Rest state: every sort in its compartment, proof marks retracted, indicator on Compose.
  gsap.set(chars, {
    x: (i) => offs[i].dx,
    y: (i) => offs[i].dy,
    scale: CASE_SCALE,
    rotation: 0,
    transformOrigin: '50% 50%',
    force3D: false,
  });
  gsap.set(sub.lines, { yPercent: 110 });
  gsap.set([rule, mark], { scaleX: 0, transformOrigin: '0% 50%' });
  gsap.set(phaseEls, { opacity: (i) => (i === 0 ? 1 : 0.38) });
  gsap.set(phaseBar, { x: phasePos[0].x, width: phasePos[0].w });

  const tl = gsap.timeline({ paused: true, defaults: { force3D: false } });
  tl.addLabel('compose', 0.45)
    .addLabel('proof', 2.55)
    .addLabel('distribute', 5.0)
    .addLabel('rest', 7.25);

  const goPhase = (n, at) => {
    tl.to(phaseBar, { x: phasePos[n].x, width: phasePos[n].w, duration: 0.45, ease: 'power3.inOut' }, at);
    tl.to(phaseEls, { opacity: (i) => (i === n ? 1 : 0.38), duration: 0.3, ease: 'none' }, at);
  };

  // Compose: reading order. x and y use different eases so each sort travels on a curve, not a straight line.
  tl.fromTo(chars, { x: (i) => offs[i].dx }, { x: 0, duration: 0.8, ease: 'power3.out', stagger: STEP, immediateRender: false }, 'compose');
  tl.fromTo(chars, { y: (i) => offs[i].dy }, { y: 0, duration: 0.8, ease: 'power3.inOut', stagger: STEP, immediateRender: false }, 'compose');
  tl.fromTo(chars, { scale: CASE_SCALE }, { scale: 1, duration: 0.8, ease: 'power2.inOut', stagger: STEP, immediateRender: false }, 'compose');

  // Each sort leans into its direction of travel and settles upright on landing.
  const last = chars.length - 1;
  chars.forEach((el, i) => {
    const lean = gsap.utils.clamp(-10, 10, -offs[i].dx / 40);
    const setAt = tl.labels.compose + i * STEP;
    const homeAt = tl.labels.distribute + 0.3 + (last - i) * BACK_STEP;
    tl.fromTo(el, { rotation: 0 }, { rotation: lean, duration: 0.3, ease: 'sine.out', immediateRender: false }, setAt);
    tl.fromTo(el, { rotation: lean }, { rotation: 0, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, setAt + 0.3);
    tl.fromTo(el, { rotation: 0 }, { rotation: -lean, duration: 0.3, ease: 'sine.out', immediateRender: false }, homeAt);
    tl.fromTo(el, { rotation: -lean }, { rotation: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, homeAt + 0.3);
  });

  // Proof: stick rule, masked subline, accent mark under the last word. Readable hold until 5.0 s.
  goPhase(1, 'proof');
  tl.fromTo(rule, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, transformOrigin: '0% 50%', duration: 0.8, ease: 'expo.out', immediateRender: false }, 'proof');
  tl.fromTo(sub.lines, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.12, immediateRender: false }, 'proof+=0.25');
  tl.fromTo(mark, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, transformOrigin: '0% 50%', duration: 0.6, ease: 'expo.out', immediateRender: false }, 'proof+=0.7');

  // Distribute: marks retract, then sorts go home last-in first-out, so line 2 clears before line 1 passes through it.
  goPhase(2, 'distribute');
  tl.fromTo(mark, { scaleX: 1, transformOrigin: '100% 50%' }, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.4, ease: 'power3.in', immediateRender: false }, 'distribute');
  tl.fromTo(sub.lines, { yPercent: 0 }, { yPercent: -110, duration: 0.45, ease: 'power3.in', stagger: 0.06, immediateRender: false }, 'distribute');
  tl.fromTo(rule, { scaleX: 1, transformOrigin: '100% 50%' }, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.6, ease: 'power3.inOut', immediateRender: false }, 'distribute+=0.1');
  const back = { each: BACK_STEP, from: 'end' };
  tl.fromTo(chars, { x: 0 }, { x: (i) => offs[i].dx, duration: 0.75, ease: 'power3.inOut', stagger: back, immediateRender: false }, 'distribute+=0.3');
  tl.fromTo(chars, { y: 0 }, { y: (i) => offs[i].dy, duration: 0.75, ease: 'power3.out', stagger: back, immediateRender: false }, 'distribute+=0.3');
  tl.fromTo(chars, { scale: 1 }, { scale: CASE_SCALE, duration: 0.75, ease: 'power2.inOut', stagger: back, immediateRender: false }, 'distribute+=0.3');

  // Rest: indicator returns to Compose, matching frame 0.
  goPhase(0, 'rest');

  tl.seek(0, false);

  return {
    seek: async (frame) => {
      tl.seek(Math.max(0, frame) / fps, false);
    },
    feature: 'gsap.timeline labels + timeline.seek(frame / 30); SplitText.create words/chars, and lines with mask: lines; function-based values; stagger { each, from: end }',
  };
}
