// EXAMPLE app, example data. Howseen-style seek(t) engine: one beatmap at 120 BPM, shared elements,
// circle floods that clear the farthest corner, then the source button returns. No timers, no CSS transitions.
const B = 60 / 120; // one beat = 0.5 s
const BEAT = { type: 1 * B, click: 3 * B, flood: 4 * B, card: 5 * B, sub: [6 * B, 7 * B, 8 * B], check: 9 * B, done: 10 * B, contract: 13 * B, clear: 14 * B };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, start, dur) => clamp((t - start) / dur);
const io = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2);
const out = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - (1 - k) ** 3);
const inn = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k ** 3);
const expo = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - 2 ** (-10 * k));
// Closed-form spring step response (stiffness, damping, mass 1). Exact 0 before the start.
function spring(tau, k, d) {
  if (tau <= 0) return 0;
  const w = Math.sqrt(k), z = d / (2 * w);
  if (z >= 1) return 1 - (1 + w * tau) * Math.exp(-w * tau);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * tau) * (Math.cos(wd * tau) + ((z * w) / wd) * Math.sin(wd * tau));
}
const SNAPPY = [320, 30], CONTAINER = [170, 26], POP = [300, 26];
const INK = '#0b0b0c', PAPER = '#f5f5f2', LIME = '#cdf24f', TASK = 'Draft launch notes';
const BTN = { x: 672, y: 336 }, BTN48 = { x: 704, y: 336 }, CHECK = { x: 211, y: 293 };
const reach = (p) => 1.05 * Math.max(...[[0, 0], [960, 0], [0, 600], [960, 600]].map(([x, y]) => Math.hypot(x - p.x, y - p.y)));
const hex = (h, i) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
const mixHex = (a, b, k) => `rgb(${[0, 1, 2].map((i) => Math.round(lerp(hex(a, i), hex(b, i), k))).join(',')})`;
const CURSOR = `<svg width='20' height='26' viewBox='0 0 20 26'><path d='M2 2 L2 21 L7 16.5 L10.5 24 L13.6 22.6 L10.2 15.4 L16.6 15.4 Z' fill='${INK}' stroke='#fff' stroke-width='1.6' stroke-linejoin='round'/></svg>`;

export function create({ root, width = 960, height = 600, fps = 30, durationFrames = 240 }) {
  root.textContent = '';
  Object.assign(root.style, { position: 'absolute', width: width + 'px', height: height + 'px', overflow: 'hidden', background: PAPER, fontFamily: `'Inter Tight', sans-serif` });
  const el = (parent, style, text, tag = 'div') => {
    const e = document.createElement(tag);
    Object.assign(e.style, { position: 'absolute' }, style);
    if (text != null) e.textContent = text;
    parent.appendChild(e);
    return e;
  };
  const mono = (color) => ({ fontFamily: `'JetBrains Mono', monospace`, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color, whiteSpace: 'nowrap' });
  const layer = (bg, z) => el(root, { left: '0', top: '0', width: '960px', height: '600px', background: bg, zIndex: z });
  const steps = (parent, active, on, off) => ['Input', 'Focus', 'Done'].forEach((s, i) => el(parent, { left: 384 + i * 76 + 'px', top: '500px', ...mono(i === active ? on : off) }, (i === active ? '● ' : '') + s));
  // Masked words: each sits in its own overflow box so it can rise from below.
  const words = (parent, list, style) => {
    const line = el(parent, { ...style, whiteSpace: 'nowrap' });
    return list.map(([w, accent]) => {
      const mask = el(line, { position: 'relative', display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.1em', marginRight: '0.24em' }, null, 'span');
      const inner = el(mask, { position: 'relative', display: 'inline-block', transformOrigin: '0 100%' }, w, 'span');
      if (accent) Object.assign(inner.style, { backgroundImage: `linear-gradient(90deg, ${LIME}, #f3ffc9, ${LIME})`, backgroundSize: '200% 100%', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' });
      return inner;
    });
  };

  // L0: INPUT page.
  const L0 = layer(PAPER, 1);
  el(L0, { left: '64px', top: '56px', ...mono('#6b6b66') }, 'Focus · Example app');
  el(L0, { left: '0', top: '196px', width: '960px', textAlign: 'center', fontSize: '44px', fontWeight: 800, letterSpacing: '-0.03em', color: INK }, 'What needs focus?');
  el(L0, { left: '220px', top: '300px', width: '520px', height: '72px', borderRadius: '18px', background: '#fff', boxShadow: '0 1px 0 rgba(11,11,12,0.06), 0 18px 40px -24px rgba(11,11,12,0.3)' });
  const holder = el(L0, { left: '250px', top: '324px', fontSize: '20px', fontWeight: 600, lineHeight: '1.2', color: '#a6a6a0' }, 'One task, one block');
  const fieldMask = el(L0, { left: '244px', top: '318px', width: '360px', height: '36px', overflow: 'hidden' });
  const fieldText = el(fieldMask, { left: '0', top: '6px', fontSize: '20px', fontWeight: 600, lineHeight: '1.2', color: INK, whiteSpace: 'nowrap' }, TASK);
  const caret = el(L0, { left: '244px', top: '324px', width: '2px', height: '24px', background: INK });
  const pill = el(L0, { right: '232px', top: '312px', height: '48px', borderRadius: '24px' });
  steps(L0, 0, INK, '#b0b0aa');

  // L1: FOCUS board, revealed by the ink flood.
  const L1 = layer(INK, 2);
  el(L1, { left: '64px', top: '56px', ...mono('#7b7b78') }, 'Focus · Example app');
  const head1 = words(L1, [['Focus'], ['on'], ['one', 1], ['thing.', 1]], { left: '170px', top: '100px', fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: '1', color: '#fff' });
  const card = el(L1, { left: '170px', top: '200px', width: '620px', height: '180px', boxSizing: 'border-box', borderRadius: '22px', background: '#161618', border: '1px solid #2a2a2e' });
  el(card, { left: '32px', top: '26px', ...mono('#8a8a86') }, 'Now · Example data');
  const cardTitle = el(card, { left: '68px', top: '76px', fontSize: '30px', fontWeight: 600, lineHeight: '1.2', color: '#fff', whiteSpace: 'nowrap' }, TASK);
  el(card, { left: '26px', top: '78px', width: '28px', height: '28px', boxSizing: 'border-box', borderRadius: '14px', border: '2px solid rgba(255,255,255,0.3)' });
  const tick = el(card, { left: '26px', top: '78px', width: '28px', height: '28px' });
  tick.innerHTML = `<svg width='28' height='28' viewBox='0 0 28 28'><circle cx='14' cy='14' r='14' fill='${LIME}'/><path d='M8.5 14.5 L12.5 18.5 L19.5 10.5' fill='none' stroke='${INK}' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='17' stroke-dashoffset='17'/></svg>`;
  const tickPath = tick.querySelector('path');
  const dots = ['Outline', 'Write', 'Review'].map((s, i) => {
    const chip = el(card, { left: 68 + i * 112 + 'px', top: '128px', height: '26px', padding: '0 12px 0 28px', borderRadius: '13px', background: '#222226', color: '#c9c9c4', fontSize: '13px', fontWeight: 600, lineHeight: '26px', whiteSpace: 'nowrap' }, s);
    el(chip, { left: '10px', top: '9px', width: '8px', height: '8px', borderRadius: '4px', background: '#3a3a3f' });
    return el(chip, { left: '10px', top: '9px', width: '8px', height: '8px', borderRadius: '4px', background: LIME });
  });
  const ring = el(card, { left: '520px', top: '54px', width: '72px', height: '72px' });
  ring.innerHTML = `<svg width='72' height='72' viewBox='0 0 72 72'><circle cx='36' cy='36' r='30' fill='none' stroke='rgba(255,255,255,0.12)' stroke-width='4'/><circle cx='36' cy='36' r='30' fill='none' stroke='${LIME}' stroke-width='4' stroke-linecap='round' stroke-dasharray='188.5' stroke-dashoffset='188.5' transform='rotate(-90 36 36)'/></svg>`;
  const arc = ring.querySelectorAll('circle')[1];
  el(card, { left: '520px', top: '84px', width: '72px', textAlign: 'center', ...mono('#c9c9c4'), letterSpacing: '0.04em' }, '25m');
  steps(L1, 1, '#fff', '#55554f');

  // L2: DONE, revealed by the lime flood from the check.
  const L2 = layer(LIME, 3);
  el(L2, { left: '64px', top: '56px', ...mono('#3d4a10') }, 'Done · Example data');
  const head2 = words(L2, [['Done.'], ['Notes'], ['shipped.']], { left: '170px', top: '196px', fontSize: '68px', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: '1', color: INK });
  const rule = el(L2, { left: '172px', top: '296px', width: '420px', height: '3px', background: INK, transformOrigin: '0 50%' });
  const note = el(L2, { left: '172px', top: '318px', ...mono('#3d4a10') }, '1 of 1 focus block finished');
  steps(L2, 2, INK, '#7d8f2a');

  // Shared elements that travel between layers.
  const label = el(root, { left: '0', top: '0', zIndex: 4, fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: '1', color: '#fff', whiteSpace: 'nowrap', transformOrigin: '0 0' }, 'Focus');
  const title = el(root, { left: '0', top: '0', zIndex: 4, fontSize: '30px', fontWeight: 600, lineHeight: '1.2', whiteSpace: 'nowrap', transformOrigin: '0 0' }, '');
  const cursor = el(root, { left: '0', top: '0', zIndex: 5, width: '20px', height: '26px', transformOrigin: '2px 2px' });
  cursor.innerHTML = CURSOR;
  const mctx = document.createElement('canvas').getContext('2d');
  mctx.font = `600 20px 'Inter Tight'`;
  const caretX = Array.from({ length: TASK.length + 1 }, (_, i) => mctx.measureText(TASK.slice(0, i)).width);
  const LW = label.offsetWidth || 128, R1 = reach(BTN), R2 = reach(CHECK);

  async function seek(frame) {
    const t = (((frame % durationFrames) + durationFrames) % durationFrames) / fps;
    // INPUT: type at 0.035 s per character, point, press.
    const n = t < BEAT.type ? 0 : Math.min(TASK.length, Math.floor((t - BEAT.type) / 0.035) + 1);
    const press = t < BEAT.click ? 0 : clamp(Math.min((t - BEAT.click) / 0.06, 1 - spring(t - BEAT.click - 0.06, ...SNAPPY)));
    const typing = t >= BEAT.type && t < BEAT.type + TASK.length * 0.035 + 0.1;
    const empty = t < BEAT.type || t > BEAT.clear + 0.3;
    caret.style.opacity = t < BEAT.flood || empty ? (typing ? 1 : t % B < 0.3 ? 1 : 0) : 0;
    caret.style.transform = `translateX(${t < BEAT.flood ? caretX[n] : 0}px)`;
    holder.style.opacity = t < BEAT.type ? 1 : out(seg(t, BEAT.clear + 0.3, 0.25));
    fieldText.style.visibility = t >= BEAT.done ? 'inherit' : 'hidden';
    fieldText.style.transform = `translateY(${-110 * inn(seg(t, BEAT.clear, 0.3))}%)`;
    const back = BEAT.contract + 0.45;
    pill.style.width = (t < BEAT.done ? 112 : t < back ? 48 : lerp(48, 112, spring(t - back, ...SNAPPY))) + 'px';
    pill.style.background = t < BEAT.done ? INK : mixHex(LIME, INK, seg(t, back, 0.25));
    pill.style.transform = `scale(${1 - 0.04 * press})`;

    // FOCUS: the button floods the page in ink from its own center, past the farthest corner in 0.33 s.
    const r1 = t < BEAT.flood ? 0 : lerp(24, R1, expo(seg(t, BEAT.flood, 0.33)));
    L1.style.visibility = t >= BEAT.flood && t < BEAT.done + 0.4 ? 'inherit' : 'hidden';
    L1.style.clipPath = `circle(${r1}px at ${BTN.x}px ${BTN.y}px)`;
    const lk = io(seg(t, BEAT.flood + 0.05, 0.5)), s0 = 16 / 48, flying = t < 6;
    const bx = BTN.x - (LW * s0) / 2, by = BTN.y - 8;
    label.style.opacity = flying ? (t < BEAT.flood + 0.55 ? 1 : 0) : out(seg(t, back + 0.15, 0.2));
    label.style.transform = flying ? `translate(${lerp(bx, 170, lk)}px, ${lerp(by, 100, lk)}px) scale(${lerp(s0, 1, lk)})` : `translate(${bx}px, ${by}px) scale(${s0})`;
    head1[0].style.opacity = t >= BEAT.flood + 0.55 ? 1 : 0;
    head1.forEach((w, i) => {
      if (!i) return;
      const k = out(seg(t, BEAT.flood + 0.3 + i * 0.055, 0.5));
      w.style.transform = `translateY(${(1 - k) * 105}%) rotate(${(1 - k) * 4}deg)`;
      if (i > 1) w.style.backgroundPosition = `${((t / 4) % 1) * 200}% 0`;
    });
    // The typed text stays on top; only its fill crossfades as the flood passes under it.
    const tk = io(seg(t, BEAT.card, 0.5)), covered = clamp((r1 - 250) / 180);
    title.textContent = t < BEAT.card ? TASK.slice(0, n) : TASK;
    title.style.visibility = t < BEAT.card + 0.5 ? 'inherit' : 'hidden';
    title.style.color = mixHex(INK, '#ffffff', covered);
    title.style.transform = `translate(${lerp(244, 239, tk)}px, ${lerp(324, 277, tk)}px) scale(${lerp(2 / 3, 1, tk)})`;
    cardTitle.style.visibility = t >= BEAT.card + 0.5 ? 'inherit' : 'hidden';
    const ck = spring(t - BEAT.card + 0.05, ...CONTAINER);
    card.style.opacity = clamp(ck * 1.5);
    card.style.transform = `translateY(${(1 - ck) * 24}px)`;
    // Micro motion on the hold: timer ring and subtask dots on the beat.
    arc.style.strokeDashoffset = 188.5 * (1 - io(seg(t, BEAT.sub[0], 1.5)));
    dots.forEach((d, i) => { const k = spring(t - BEAT.sub[i], ...POP); d.style.opacity = clamp(k * 2); d.style.transform = `scale(${0.4 + 0.6 * k})`; });
    const pk = spring(t - BEAT.check, ...POP);
    tick.style.opacity = clamp(pk * 2);
    tick.style.transform = `scale(${0.6 + 0.4 * pk})`;
    tickPath.style.strokeDashoffset = 17 * (1 - out(seg(t, BEAT.check + 0.08, 0.25)));

    // DONE: lime floods out of the check, then contracts back into the Focus button.
    const ck2 = io(seg(t, BEAT.contract, 0.45));
    const r2 = t < BEAT.contract ? lerp(14, R2, expo(seg(t, BEAT.done, 0.33))) : lerp(R2, 24, ck2);
    L2.style.visibility = t >= BEAT.done && ck2 < 1 ? 'inherit' : 'hidden';
    L2.style.clipPath = `circle(${r2}px at ${lerp(CHECK.x, BTN48.x, ck2)}px ${lerp(CHECK.y, BTN48.y, ck2)}px)`;
    const gone = inn(seg(t, BEAT.contract - 0.12, 0.2));
    head2.forEach((w, i) => {
      const k = out(seg(t, BEAT.done + 0.25 + i * 0.055, 0.5));
      w.style.transform = `translateY(${(1 - k) * 105 - gone * 105}%) rotate(${(1 - k) * 4}deg)`;
    });
    rule.style.transform = `scaleX(${out(seg(t, BEAT.done + 0.6, 0.85)) * (1 - gone)})`;
    note.style.opacity = out(seg(t, BEAT.done + 0.5, 0.3)) * (1 - gone);

    const mv = io(seg(t, 0.9, 0.5)), ret = out(seg(t, 7.3, 0.5));
    const [cx, cy] = flying ? [lerp(560, 676, mv), lerp(470, 342, mv)] : [560, 470 + 8 * (1 - ret)];
    cursor.style.opacity = flying ? 1 - seg(t, BEAT.flood + 0.1, 0.2) : ret;
    cursor.style.transform = `translate(${cx - 2}px, ${cy - 2}px) scale(${1 - 0.1 * press})`;
  }
  return { seek, label: 'Howseen · motion-design', feature: 'seek(t) engine, shared-element floods, 120 BPM beatmap', dark: false };
}
export default { create };
