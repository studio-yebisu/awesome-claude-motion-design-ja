import React from 'react';
import {AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import TL from './whaley-timeline.json';

// EXAMPLE product, fictional track. Every beat lives in whaley-timeline.json; the cue sheet reads the same file.
const C = {bg: '#0e0d0c', panel: '#161412', line: '#2b2824', clip: '#211e1b', bone: '#efe9df', muted: '#8b847a', coral: '#ff6b4a'};
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeIn = Easing.bezier(0.6, 0, 0.9, 0.35);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
type Cfg = {damping: number; stiffness: number; mass: number};
const SPRING: Record<'knob' | 'heavy' | 'elastic', Cfg> = {
  knob: {damping: 12, stiffness: 190, mass: 0.75},
  heavy: {damping: 18, stiffness: 180, mass: 0.9},
  elastic: {damping: 8, stiffness: 200, mass: 1}, // the one hero moment
};
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const prog = (t: number, t0: number, t1: number, ease: (x: number) => number = easeOut) => interpolate(t, [t0, t1], [0, 1], {...CLAMP, easing: ease});
const band = (x: number, a: number, b: number) => interpolate(x, [a, b], [0, 1], CLAMP);
const c01 = (x: number) => Math.min(1, Math.max(0, x));
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const sp = (frame: number, fps: number, startSec: number, config: Cfg) => spring({frame: Math.max(0, frame - startSec * fps), fps, config});
const mono: React.CSSProperties = {fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.muted};

const PX = 84, PW = 792, M = 64, CX = 480, CY = 336;
const trackY = (i: number) => 306 + i * 66;
const TRACKS = [
  [[0.02, 0.3], [0.34, 0.58], [0.64, 0.97]],
  [[0.1, 0.44], [0.5, 0.88]],
  [[0.02, 0.2], [0.26, 0.52], [0.58, 0.75], [0.8, 0.98]],
];
// Three clips start un-snapped; each lands on its own s1 beat.
const LOOSE: Record<string, {dx: number; beat: number}> = {'2-0': {dx: 0.03, beat: 0}, '0-1': {dx: 0.02, beat: 1}, '0-2': {dx: -0.03, beat: 2}};
type Bar = {track: number; clip: string; x: number; h: number; j: number};
const BARS: Bar[] = [];
TRACKS.forEach((clips, track) =>
  clips.forEach(([a, b], ci) => {
    for (let x = PX + a * PW + 8; x < PX + b * PW - 6; x += 9) BARS.push({track, clip: `${track}-${ci}`, x, h: 8 + 30 * rand(BARS.length) ** 1.4, j: 0});
  }),
);
BARS.forEach((b, n) => (b.j = Math.floor((n * M) / BARS.length)));
const HB = Array.from({length: M}, (_, j) => 12 + 74 * Math.sin((Math.PI * (j + 0.5)) / M) ** 0.8 * (0.5 + 0.5 * rand(j + 500)));
type P = {x: number; y: number; h: number; r: number};
const mix = (a: P, b: P, k: number): P => ({x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, h: a.h + (b.h - a.h) * k, r: a.r + (b.r - a.r) * k});

const Word: React.FC<{t: number; text: string; inAt: number | null; outAt: number; dur?: number}> = ({t, text, inAt, outAt, dur = 0.8}) => {
  const enter = inAt === null ? 1 : prog(t, inAt, inAt + dur);
  const exit = prog(t, outAt, outAt + dur / 2, easeIn); // exits are half an entrance
  return <span style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 100%', transform: `translateY(${(1 - enter) * 105 - exit * 105}%) rotate(${(1 - enter) * 3}deg)`}}>{text}</span>;
};

const Backdrop: React.FC<{t: number}> = ({t}) => {
  const drift = (t / TL.duration) * 24; // one dot cell per loop, so the seam is invisible
  return (
    <svg width={960} height={600} style={{position: 'absolute'}}>
      <defs>
        <pattern id='dots' width={24} height={24} patternUnits='userSpaceOnUse' patternTransform={`translate(${drift} ${-drift})`}>
          <circle cx={12} cy={12} r={1.1} fill={C.line} />
        </pattern>
        <radialGradient id='vig' cx='50%' cy='50%' r='75%'>
          <stop offset='55%' stopColor='#000' stopOpacity={0} />
          <stop offset='100%' stopColor='#000' stopOpacity={0.65} />
        </radialGradient>
      </defs>
      <rect width={960} height={600} fill='url(#dots)' />
      <rect width={960} height={600} fill='url(#vig)' />
    </svg>
  );
};

const Grain: React.FC<{frame: number}> = ({frame}) => (
  <svg width={960} height={600} style={{position: 'absolute', opacity: 0.09, pointerEvents: 'none'}}>
    <filter id='grain'>
      <feTurbulence type='fractalNoise' baseFrequency={0.85} numOctaves={2} seed={Math.floor(frame / 2)} />
      <feColorMatrix type='saturate' values='0' />
    </filter>
    <rect width={960} height={600} filter='url(#grain)' />
  </svg>
);

export const WhaleyFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const {s1, s2, s3, s4} = TL;
  const snaps = s1.snaps.map((b) => sp(frame, fps, b, SPRING.knob));
  const loose = (key: string) => (LOOSE[key] ? (t >= s4.unwrap ? 1 : 1 - snaps[LOOSE[key].beat]) : 0);
  const phX = PX + PW * prog(t, s2.playStart, s2.playEnd, Easing.linear);
  const mode = sp(frame, fps, s2.toggle, SPRING.knob) - sp(frame, fps, s4.toggleBack, SPRING.knob);
  const chrome = 1 - prog(t, s3.collapse, s3.collapse + 0.3, easeIn) + prog(t, s4.unwrap + 0.15, s4.end);
  const playhead = prog(t, s2.toggle, s2.toggle + 0.15) * (1 - prog(t, s3.collapse, s3.collapse + 0.3, easeIn));
  const amp = t < s3.hit ? 1 : 1.35 - 0.35 * sp(frame, fps, s3.hit, SPRING.elastic);
  const bloom = t < s3.hit ? 0 : Math.exp(-(t - s3.hit) * 3.5) * (1 - prog(t, s4.wrap, s4.cover));
  const cover = sp(frame, fps, s4.wrap + 0.1, SPRING.heavy) * (1 - prog(t, s4.unwrap, s4.unwrap + 0.35, easeIn));
  const spin = t > s4.cover ? ((Math.min(t, s4.unwrap) - s4.cover) * 6 * Math.PI) / 180 : 0; // slow idle turn, frozen before the unwrap
  // Glow is state, not time: it rises with what has been played and peaks once the mix is one waveform.
  const glow = Math.max(band(phX, PX, PX + PW), prog(t, s3.collapse, s3.hit)) * (1 - prog(t, s4.unwrap, s4.end));

  const clips = TRACKS.flatMap((cl, track) =>
    cl.map(([a, b], ci) => {
      const key = `${track}-${ci}`, lz = loose(key);
      const lit = band(phX - (PX + a * PW), 0, 20) * (1 - band(phX - (PX + b * PW), 0, 20));
      return {key, x: PX + (a + (LOOSE[key]?.dx ?? 0) * lz) * PW, y: trackY(track) - 26 - 10 * lz, w: (b - a) * PW, lit, lz};
    }),
  );
  // The same bars travel through every scene: clip waveforms, one waveform, then the radial cover.
  const bars = BARS.map((b) => {
    const lz = loose(b.clip), dx = (LOOSE[b.clip]?.dx ?? 0) * PW * lz;
    const A: P = {x: b.x + dx, y: trackY(b.track) - 10 * lz, h: b.h, r: 0};
    const B: P = {x: CX + (b.j - (M - 1) / 2) * 9, y: 368, h: HB[b.j] * amp, r: 0};
    const a = (b.j / M) * Math.PI * 2 - Math.PI / 2 + spin, len = 6 + HB[b.j] * 0.5, rr = 44 + len / 2;
    const deg = (a * 180) / Math.PI + 90;
    const Cp: P = {x: CX + Math.cos(a) * rr, y: CY + Math.sin(a) * rr, h: len, r: (((deg % 180) + 270) % 180) - 90};
    const q = b.j / M;
    const kB = prog(t, s3.collapse + 0.15 * q, s3.hit, easeInOut);
    const kC = prog(t, s4.wrap + 0.08 * q, s4.cover, easeInOut);
    const kA = prog(t, s4.unwrap + 0.1 * q, s4.end, easeInOut);
    const p = mix(mix(mix(A, B, kB), Cp, kC), A, kA);
    const heat = Math.max(band(phX - b.x, 0, 14), kB) * (1 - kA);
    return {...p, fill: interpolateColors(heat, [0, 1], [C.muted, C.coral])};
  });

  return (
    <AbsoluteFill style={{backgroundColor: C.bg, fontFamily: 'Inter Tight', color: C.bone}}>
      <Backdrop t={t} />
      <div style={{...mono, position: 'absolute', left: 60, top: 52}}>Driftnote · Example audio app</div>
      <div style={{position: 'absolute', left: 60, top: 92, fontWeight: 800, fontSize: 64, lineHeight: 1, letterSpacing: '-0.02em'}}>
        <div style={{position: 'relative', width: 320, height: 72, overflow: 'hidden'}}>
          <Word t={t} text='Shape' inAt={null} outAt={s2.title} />
          <Word t={t} text='Play' inAt={s2.title + 0.09} outAt={s4.title} />
          <Word t={t} text='Keep' inAt={s4.title + 0.09} outAt={s4.titleBack} />
          <Word t={t} text='Shape' inAt={s4.titleBack + 0.05} outAt={TL.duration + 1} dur={0.45} />
        </div>
        <div>
          the <span style={{color: C.coral, textShadow: `0 0 ${28 * glow}px rgba(255,107,74,${0.55 * glow})`}}>mix.</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 750, top: 44, width: 150, height: 36, borderRadius: 18, background: C.panel, boxShadow: `inset 0 0 0 1px ${C.line}`}}>
        <div style={{position: 'absolute', left: 4, top: 4, width: 70, height: 28, borderRadius: 14, background: C.bone, transform: `translateX(${72 * mode}px)`}} />
        {['Edit', 'Play'].map((s, i) => (
          <div key={s} style={{...mono, position: 'absolute', left: i * 72 + 4, top: 0, width: 70, lineHeight: '36px', textAlign: 'center', fontSize: 11, letterSpacing: '0.18em', color: interpolateColors(c01(i ? mode : 1 - mode), [0, 1], [C.muted, C.bg])}}>
            {s}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: CX - 360, top: 248, width: 720, height: 240, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(255,107,74,${0.4 * bloom}), rgba(255,107,74,0))`}} />
      <div style={{position: 'absolute', left: CX - 140, top: CY - 140, width: 280, height: 280, borderRadius: 20, opacity: c01(cover), transform: `scale(${0.9 + 0.1 * cover})`, background: 'linear-gradient(160deg, #2a1d17, #120e0c)', boxShadow: `inset 0 0 0 1px ${C.line}, 0 30px 80px -30px rgba(255,107,74,${0.5 * c01(cover)})`}}>
        <div style={{...mono, position: 'absolute', left: 20, top: 18, fontSize: 10}}>Example single</div>
        <div style={{position: 'absolute', left: 20, bottom: 18, fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em'}}>Night Tide</div>
      </div>
      <svg width={960} height={600} style={{position: 'absolute'}}>
        <g opacity={chrome}>
          <rect x={60} y={250} width={840} height={236} rx={16} fill={C.panel} stroke={C.line} />
          {Array.from({length: 17}, (_, i) => (
            <line key={i} x1={PX + (i * PW) / 16} x2={PX + (i * PW) / 16} y1={258} y2={i % 4 ? 263 : 270} stroke={C.line} strokeWidth={1.5} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <text key={i} x={PX + (i * PW) / 4 + 6} y={269} fill={C.muted} fontFamily='JetBrains Mono' fontSize={10}>{i + 1}</text>
          ))}
          {clips.map((c) => (
            <rect key={c.key} x={c.x} y={c.y} width={c.w} height={52} rx={10} fill={C.clip} stroke={interpolateColors(c.lit, [0, 1], [C.line, C.coral])} strokeWidth={1.5} opacity={1 - 0.3 * c.lz} />
          ))}
        </g>
        <g opacity={playhead}>
          <line x1={phX} x2={phX} y1={256} y2={480} stroke={C.coral} strokeWidth={2} />
          <circle cx={phX} cy={256} r={4} fill={C.coral} />
        </g>
        {bars.map((p, i) => (
          <rect key={i} x={p.x - 2} y={p.y - p.h / 2} width={4} height={p.h} rx={2} fill={p.fill} transform={`rotate(${p.r} ${p.x} ${p.y})`} />
        ))}
      </svg>
      <div style={{...mono, position: 'absolute', left: 60, top: 512}}>{`120 BPM · Bar ${Math.min(4, Math.floor(t / 2) + 1)} of 4 · Example data`}</div>
      <Grain frame={frame} />
    </AbsoluteFill>
  );
};
