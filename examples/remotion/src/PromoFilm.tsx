/**
 * Studio Yebisu original promotional film.
 * Concept, editorial direction and production: Studio Yebisu.
 * Implementation assistance: Claude Opus 5.5; integration and export: Codex.
 */
import type React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Audio, Video } from '@remotion/media';

// Promo Film — 40 s, 1920x1080, 30 fps. Built on a 120 BPM grid: one bar = 2 s = 60 frames,
// and every major cut lands on a bar line. Dark and ivory sections alternate, and each scene
// owns the shape that carries the film into the next one: iris → rising slab → six columns →
// lightbox → wipe → rising panel. See PROMO_STORYBOARD.md for the beat sheet.

const IVORY = '#f5f2ec';
const PAPER = '#fffdf8';
const CHAR = '#1a1916';
const INK = '#17150f';
const MUTED = '#6a645a';
const DIM = 'rgba(245, 242, 236, 0.66)';
const EMERALD = '#0f7a63';
const DEEP = '#0b5546';
const MINT = '#5fd3a8';
const CORAL = '#ee6c56';
const JP = `'Inter Tight', 'Yu Gothic', 'YuGothic', 'Meiryo', sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const EASE_IN = Easing.bezier(0.64, 0, 0.78, 0);

const SPECIMEN_IDS = [
  'remotion-skills', 'emil-skills', 'motion-graphics-skills', 'claude-motion', 'claude-motion-design', 'motion-skill',
  'iart-motion-skills', 'opus-video-prompts', 'hyperframes', 'remotion', 'motion-canvas', 'ffmpeg', 'ffmpeg-wasm',
  'mediabunny', 'playwright', 'motion', 'gsap', 'anime', 'confetti', 'three', 'fiber', 'drei', 'cobe', 'twgl',
  'fabric', 'rive', 'lottie', 'pixi', 'deck', 'd3', 'manim',
] as const;

type SpecimenProps = {
  readonly id: string;
  readonly trim: number;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly style?: React.CSSProperties;
};

// A live 960x600 specimen, contained in an 8:5 frame so nothing is cropped. `trim` is in seconds.
const Specimen: React.FC<SpecimenProps> = ({ id, trim, left, top, width, style }) => {
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: 'absolute', left, top, width, height: width * 0.625, borderRadius: 14, overflow: 'hidden', backgroundColor: '#0c0c0a', ...style }}>
      <Video src={staticFile(`promo/clips/${id}.mp4`)} trimBefore={Math.round(trim * fps)} muted objectFit='contain' style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

type LineProps = {
  readonly children: React.ReactNode;
  readonly left: number;
  readonly top: number;
  readonly size: number;
  readonly delay?: number;
  readonly exitAt?: number;
  readonly color?: string;
  readonly weight?: number;
  readonly font?: string;
};

// One masked line of type: rises into its slot, and leaves upward through the same mask.
const Line: React.FC<LineProps> = ({ children, left, top, size, delay = 0, exitAt, color = IVORY, weight = 700, font = JP }) => {
  const frame = useCurrentFrame();
  const h = Math.round(size * 1.32);
  const enter = interpolate(frame, [delay, delay + 13], [1, 0], { ...CLAMP, easing: EASE_OUT });
  const exit = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 9], [0, 1], { ...CLAMP, easing: EASE_IN });
  return (
    <div style={{ position: 'absolute', left, top, height: h, overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <div style={{ fontFamily: font, fontSize: size, lineHeight: `${h}px`, fontWeight: weight, color, letterSpacing: size >= 60 ? '-0.02em' : '0', translate: `0px ${(enter - exit) * h}px` }}>
        {children}
      </div>
    </div>
  );
};

// 01 · bars 1–2 · The hook plays a real specimen from frame 0, then an ivory iris opens from its centre.
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [0, 12], [0.45, 1], { ...CLAMP, easing: EASE_OUT });
  const iris = interpolate(frame, [104, 120], [0, 1450], { ...CLAMP, easing: EASE_IN });
  return (
    <AbsoluteFill style={{ backgroundColor: CHAR }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '1310px 540px', scale: `${interpolate(frame, [0, 120], [1, 1.04])}` }}>
        <Specimen id='three' trim={2} left={770} top={202} width={1080} style={{ clipPath: `inset(${(1 - open) * 50}% 0 round 14px)` }} />
      </div>
      <Line font={MONO} weight={400} size={30} color={MINT} left={70} top={318} exitAt={98}>CLAUDE × MOTION DESIGN</Line>
      <Line size={100} left={64} top={380} delay={3} exitAt={98}>その動き、</Line>
      <Line size={100} left={64} top={512} delay={7} exitAt={100}>どうつくる？</Line>
      <Line size={30} weight={600} color={DIM} left={770} top={902} delay={12} exitAt={98}>Three.js — 360本の柱が、31の形になる</Line>
      <AbsoluteFill style={{ backgroundColor: IVORY, clipPath: `circle(${iris}px at 1310px 540px)` }} />
    </AbsoluteFill>
  );
};

// 02 · bars 3–4 · The whole catalog ripples in as a wall; the counter is the number of tiles landed.
const Catalog: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayOf = (i: number) => 2 + Math.hypot((i % 8) - 3.5, Math.floor(i / 8) - 1.5) * 3.2;
  const landed = SPECIMEN_IDS.filter((_, i) => frame >= delayOf(i) + 4).length;
  const slab = interpolate(frame, [106, 120], [100, 0], { ...CLAMP, easing: EASE_IN });
  return (
    <AbsoluteFill style={{ backgroundColor: IVORY }}>
      <div style={{ position: 'absolute', inset: 0, translate: `0px ${interpolate(frame, [0, 120], [8, -8])}px` }}>
        {[...SPECIMEN_IDS, 'all'].map((id, i) => {
          const pop = spring({ frame: frame - delayOf(i), fps, config: { damping: 14, stiffness: 170 } });
          return (
            <div
              key={id}
              style={{
                position: 'absolute',
                left: 77 + (i % 8) * 222,
                top: 70 + Math.floor(i / 8) * 142.5,
                width: 212,
                height: 132.5,
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: id === 'all' ? CORAL : '#e4dfd5',
                opacity: interpolate(frame - delayOf(i), [0, 4], [0, 1], CLAMP),
                scale: `${0.6 + 0.4 * pop}`,
              }}
            >
              {id === 'all' ? (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 30, color: IVORY }}>ALL ↗</div>
              ) : (
                <Img src={staticFile(`promo/posters/${id}.webp`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 62, top: 666, fontSize: 240, lineHeight: '240px', fontWeight: 800, color: EMERALD, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', opacity: interpolate(frame, [2, 8], [0, 1], CLAMP) }}>
        {landed}
      </div>
      <Line size={100} color={INK} left={380} top={706} delay={10}>本の、動く作例。</Line>
      <Line size={32} weight={600} color={MUTED} left={384} top={850} delay={16}>スキル・エンジン・ライブラリを、実際の映像で比べる。</Line>
      <AbsoluteFill style={{ backgroundColor: CHAR, translate: `0px ${slab}%` }} />
    </AbsoluteFill>
  );
};

type ReelCutProps = {
  readonly id: string;
  readonly trim: number;
  readonly no: string;
  readonly verb: readonly [string, string];
  readonly tool: string;
  readonly title: string;
  readonly accent: string;
  readonly dur: number;
};

// 03 · one expression in the reel. Each cut opens with a slab in the category colour.
const ReelCut: React.FC<ReelCutProps> = ({ id, trim, no, verb, tool, title, accent, dur }) => {
  const frame = useCurrentFrame();
  const out = dur - 7;
  const slab = interpolate(frame, [0, 10], [1, 0], { ...CLAMP, easing: EASE_IN_OUT });
  const bar = interpolate(frame, [4, 14], [0, 1], { ...CLAMP, easing: EASE_OUT }) * interpolate(frame, [out, out + 7], [1, 0], CLAMP);
  return (
    <AbsoluteFill>
      <Specimen id={id} trim={trim} left={670} top={171} width={1180} />
      <div style={{ position: 'absolute', left: 670, top: 171, width: 1180, height: 737.5, borderRadius: 14, backgroundColor: accent, transformOrigin: '100% 50%', scale: `${slab} 1` }} />
      <Line font={MONO} weight={400} size={30} color={accent} left={70} top={171}>EXPRESSION {no} / 05</Line>
      <Line size={96} left={64} top={360} delay={2} exitAt={out}>{verb[0]}</Line>
      <Line size={96} left={64} top={485} delay={5} exitAt={out}>{verb[1]}</Line>
      <div style={{ position: 'absolute', left: 70, top: 712, width: 72, height: 6, backgroundColor: accent, transformOrigin: '0% 50%', scale: `${bar} 1` }} />
      <Line size={48} weight={600} left={70} top={730} delay={6} exitAt={out}>{tool}</Line>
      <Line size={30} weight={600} color={DIM} left={70} top={808} delay={8} exitAt={out}>{title}</Line>
    </AbsoluteFill>
  );
};

// Six ivory columns drop in, foreshadowing the six category bars that follow.
const SixColumns: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ position: 'absolute', left: i * 320, top: 0, width: 321, height: 1080, backgroundColor: IVORY, transformOrigin: '50% 0%', scale: `1 ${interpolate(frame, [i, i + 10], [0, 1], { ...CLAMP, easing: EASE_IN_OUT })}` }} />
      ))}
    </AbsoluteFill>
  );
};

// 03 · bars 5–8 · Five expressions; the cadence doubles for the last bar.
const Reel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CHAR }}>
    <Sequence name='Reel 1 · GSAP 文字を組む' from={0} durationInFrames={60} premountFor={30}>
      <ReelCut id='gsap' trim={2.5} no='01' verb={['文字を', '組む。']} tool='GSAP' title='活字棚から、言葉を組み上げる' accent='#c8b7f0' dur={60} />
    </Sequence>
    <Sequence name='Reel 2 · PixiJS 粒を集める' from={60} durationInFrames={60} premountFor={30}>
      <ReelCut id='pixi' trim={2.6} no='02' verb={['粒を', '集める。']} tool='PixiJS' title='散らばった粒が、FORMに集まる' accent='#eba9ad' dur={60} />
    </Sequence>
    <Sequence name='Reel 3 · TWGL 光を流す' from={120} durationInFrames={60} premountFor={30}>
      <ReelCut id='twgl' trim={3} no='03' verb={['光を', '流す。']} tool='TWGL.js' title='GLSLが描く、有機的な帯' accent='#99d6d5' dur={60} />
    </Sequence>
    <Sequence name='Reel 4 · deck.gl データを立てる' from={180} durationInFrames={30} premountFor={30}>
      <ReelCut id='deck' trim={3.4} no='04' verb={['データを', '立てる。']} tool='deck.gl' title='5,000点から、街の脈動を見る' accent='#aebee8' dur={30} />
    </Sequence>
    <Sequence name='Reel 5 · Anime.js 線を描く' from={210} durationInFrames={30} premountFor={30}>
      <ReelCut id='anime' trim={3.6} no='05' verb={['線を', '描く。']} tool='Anime.js' title='線から秩序へ、形から流れへ' accent='#f2c078' dur={30} />
    </Sequence>
    <Sequence name='Exit · six ivory columns' from={224} durationInFrames={16}>
      <SixColumns />
    </Sequence>
  </AbsoluteFill>
);

const CATEGORIES = [
  { tag: '01 DIRECT', name: '制作スキル', count: 8, color: '#cbe681' },
  { tag: '02 RENDER', name: '動画・書き出し', count: 7, color: '#f2c078' },
  { tag: '03 ANIMATE', name: 'UI・文字', count: 4, color: '#c8b7f0' },
  { tag: '04 DEPTH', name: '3D・シェーダー', count: 5, color: '#99d6d5' },
  { tag: '05 DRAW', name: '2D・ベクター', count: 4, color: '#eba9ad' },
  { tag: '06 EXPLAIN', name: 'データ・図解', count: 3, color: '#aebee8' },
] as const;

// 04 · bars 9–10 · The six categories as a bar chart of their entry counts; 3D is singled out for the search.
const Categories: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const focus = interpolate(frame, [62, 72], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  return (
    <AbsoluteFill style={{ backgroundColor: IVORY }}>
      <Line size={100} color={INK} left={64} top={90} delay={2} exitAt={100}>つくりたいものから、</Line>
      <Line size={100} color={INK} left={64} top={222} delay={6} exitAt={102}>選ぶ。</Line>
      <Line size={32} weight={600} color={MUTED} left={70} top={376} delay={12} exitAt={102}>6カテゴリ・31件を、日本語で比較。</Line>
      <div style={{ position: 'absolute', left: 70, top: 899, width: 1780, height: 2, backgroundColor: INK, opacity: 0.2, transformOrigin: '0% 50%', scale: `${interpolate(frame, [0, 14, 104, 116], [0, 1, 1, 0], { ...CLAMP, easing: EASE_IN_OUT })} 1` }} />
      {CATEGORIES.map((c, i) => {
        const grow = spring({ frame: frame - 8 - i * 3, fps, config: { damping: 20, stiffness: 150 } });
        const drop = interpolate(frame, [100 + i, 110 + i], [1, 0], { ...CLAMP, easing: EASE_IN });
        const h = c.count * 44;
        const left = 70 + i * 300;
        return (
          <div key={c.tag} style={{ opacity: i === 3 ? 1 : 1 - 0.62 * focus }}>
            <div style={{ position: 'absolute', left, top: 900 - h * grow * drop - 96, fontSize: 76, lineHeight: '90px', fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums', opacity: drop }}>
              {Math.round(c.count * Math.min(1, grow))}
            </div>
            <div style={{ position: 'absolute', left, top: 900 - h, width: 280, height: h, borderRadius: '10px 10px 0 0', backgroundColor: c.color, transformOrigin: '50% 100%', scale: `1 ${grow * drop}` }} />
            <div style={{ position: 'absolute', left: left + 18, top: 916 - h, fontFamily: MONO, fontSize: 30, color: INK, opacity: interpolate(grow, [0.85, 1], [0, 1], CLAMP) * drop }}>{c.tag}</div>
            <Line size={34} color={INK} left={left} top={918} delay={12 + i * 3} exitAt={100 + i}>{c.name}</Line>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const RESULTS = [
  { id: 'three', name: 'Three.js' },
  { id: 'fiber', name: 'React Three Fiber' },
  { id: 'drei', name: 'Drei' },
] as const;

const CHIPS = [
  { label: 'すべて 31', active: false },
  { label: '3D・シェーダー 5', active: true },
  { label: 'データ・図解 3', active: false },
] as const;

// 05 · bars 11–12 · Search, filter, then the Fiber card expands into the lightbox; its backdrop becomes the next scene.
const SearchAndExpand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const panel = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 16 });
  const query = frame < 8 ? '' : frame < 13 ? '3' : '3D';
  const chipOn = interpolate(frame, [18, 24], [0, 1], CLAMP);
  const e = interpolate(frame, [58, 78], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const close = interpolate(frame, [108, 120], [0, 1], { ...CLAMP, easing: EASE_IN });
  const lerp = (a: number, b: number) => a + (b - a) * e;
  const card = (i: number) => spring({ frame: frame - 22 - i * 4, fps, config: { damping: 200 }, durationInFrames: 14 });
  const lift = (1 - panel) * 40;
  return (
    <AbsoluteFill style={{ backgroundColor: IVORY }}>
      <Line size={96} color={INK} left={64} top={330} delay={2}>探して、</Line>
      <Line size={96} color={INK} left={64} top={455} delay={6}>すぐ確かめる。</Line>
      <Line size={32} weight={600} color={MUTED} left={70} top={610} delay={12}>検索・絞り込み・拡大再生</Line>

      <div style={{ position: 'absolute', left: 860, top: 240, width: 990, height: 500, borderRadius: 20, backgroundColor: PAPER, boxShadow: 'inset 0 0 0 2px #d9d3c7', opacity: panel, translate: `0px ${lift}px` }}>
        <div style={{ position: 'absolute', left: 40, top: 40, width: 910, height: 84, borderRadius: 42, boxShadow: `inset 0 0 0 2px ${INK}` }}>
          <div style={{ position: 'absolute', left: 30, top: 24, width: 26, height: 26, borderRadius: 13, boxShadow: `inset 0 0 0 4px ${INK}` }} />
          <div style={{ position: 'absolute', left: 52, top: 48, width: 4, height: 14, backgroundColor: INK, rotate: '-45deg' }} />
          <div style={{ position: 'absolute', left: 84, top: 0, fontSize: 34, lineHeight: '84px', fontWeight: 700, color: query ? INK : MUTED }}>
            {query || '作例・ツールを検索'}
            <span style={{ display: 'inline-block', width: 3, height: 40, marginLeft: 6, verticalAlign: '-6px', backgroundColor: EMERALD, opacity: query && frame % 16 < 8 ? 1 : 0 }} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: 40, top: 150, display: 'flex', gap: 14 }}>
          {CHIPS.map((c) => (
            <div key={c.label} style={{ height: 56, padding: '0 22px', borderRadius: 28, fontSize: 30, lineHeight: '56px', fontWeight: 700, color: c.active && chipOn > 0.5 ? IVORY : INK, backgroundColor: c.active ? `rgba(15, 122, 99, ${chipOn})` : 'transparent', boxShadow: `inset 0 0 0 2px ${c.active && chipOn > 0.5 ? EMERALD : INK}` }}>
              {c.label}
            </div>
          ))}
        </div>
        {RESULTS.map((r, i) => (
          <div key={r.id} style={{ position: 'absolute', inset: 0, opacity: card(i), translate: `0px ${(1 - card(i)) * 24}px` }}>
            {i === 1 ? null : <Specimen id={r.id} trim={2} left={40 + i * 310} top={236} width={290} />}
            <div style={{ position: 'absolute', left: 40 + i * 310, top: 431, fontSize: 30, fontWeight: 600, color: INK }}>{r.name}</div>
          </div>
        ))}
      </div>

      <AbsoluteFill style={{ backgroundColor: CHAR, opacity: Math.max(e * 0.94, close) }} />
      <Specimen
        id='fiber'
        trim={2}
        left={lerp(1210, 320)}
        top={lerp(476, 100) + lift + (1 - card(1)) * 24}
        width={lerp(290, 1280)}
        style={{ opacity: card(1) * (1 - close), scale: `${1 - close * 0.03}`, boxShadow: `0 30px 80px rgba(0, 0, 0, ${0.4 * e})` }}
      />
      <div style={{ opacity: 1 - close }}>
        <Line size={34} left={320} top={926} delay={78}>React Three Fiber — Reactの部品で、均衡する立体を</Line>
        <div style={{ position: 'absolute', right: 320, top: 934, fontFamily: MONO, fontSize: 30, color: MINT, opacity: interpolate(frame, [84, 92], [0, 1], CLAMP) }}>GIF ↗　制作コード ↗</div>
      </div>
    </AbsoluteFill>
  );
};

const PILLS = [
  { label: 'GIF ↗', at: 22 },
  { label: '制作コード ↗', at: 34 },
  { label: '出典・ライセンス ↗', at: 46 },
] as const;

// Real lines from ReleaseNotes.tsx, the source of the remotion-skills specimen.
const CODE = ["<Sequence name='Note · Added'", '  from={Math.round(1.0 * fps)}', '  premountFor={fps}>', "  <NoteRow tag='Added' … />"];

// 06a · bars 13–14 · Every specimen ships with a GIF, its production code and its sources.
const GifAndCode: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 16], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const leave = interpolate(frame, [108, 120], [0, 1], { ...CLAMP, easing: EASE_IN });
  const typed = Math.max(0, Math.floor((frame - 44) * 2.6));
  return (
    <AbsoluteFill style={{ backgroundColor: CHAR }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - leave, translate: `${-60 * leave}px 0px` }}>
        <Specimen id='remotion-skills' trim={2.5} left={70} top={150} width={1040} style={{ clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0 round 14px)` }} />
        <Line size={30} weight={600} color={DIM} left={70} top={828} delay={10}>remotion-skills — リリースノートを一本の映像に</Line>
        <Line size={92} left={1166} top={150} delay={4}>GIFも、</Line>
        <Line size={92} left={1166} top={272} delay={8}>制作コードも。</Line>
        <div style={{ position: 'absolute', left: 1170, top: 420, width: 680, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {PILLS.map((p) => {
            const on = frame >= p.at + 2;
            return (
              <div key={p.label} style={{ height: 60, padding: '0 26px', borderRadius: 30, fontSize: 30, lineHeight: '60px', fontWeight: 700, color: on ? CHAR : IVORY, backgroundColor: on ? MINT : 'transparent', boxShadow: `inset 0 0 0 2px ${on ? MINT : 'rgba(245, 242, 236, 0.5)'}`, opacity: interpolate(frame, [p.at - 12, p.at - 6], [0, 1], CLAMP), scale: `${interpolate(frame, [p.at, p.at + 4, p.at + 10], [1, 0.9, 1], CLAMP)}` }}>
                {p.label}
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 1170, top: 590, width: 680, height: 290, boxSizing: 'border-box', padding: '22px 26px', borderRadius: 14, backgroundColor: '#0f0f0d', boxShadow: 'inset 0 0 0 1px rgba(245, 242, 236, 0.14)', fontFamily: MONO, fontSize: 30, lineHeight: '46px', opacity: interpolate(frame, [36, 44], [0, 1], CLAMP) }}>
          <div style={{ color: MINT }}>ReleaseNotes.tsx</div>
          {CODE.map((line, i) => {
            const start = CODE.slice(0, i).reduce((n, l) => n + l.length, 0);
            return <div key={line} style={{ color: IVORY, whiteSpace: 'pre' }}>{line.slice(0, Math.max(0, typed - start)) || ' '}</div>;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

type StatProps = { readonly value: number; readonly label: string; readonly color: string };

const Stat: React.FC<StatProps> = ({ value, label, color }) => (
  <div>
    <div style={{ fontSize: 150, lineHeight: '150px', fontWeight: 800, color, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    <div style={{ marginTop: 10, fontSize: 32, fontWeight: 700, color: IVORY }}>{label}</div>
  </div>
);

// 06b · bars 15–16 · Skills are shown by what they produce; then a deep-emerald wipe opens the finale.
const SkillsAndTools: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 18 });
  const count = interpolate(frame, [18, 42], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const wipe = interpolate(frame, [106, 120], [-100, 0], { ...CLAMP, easing: EASE_IN });
  return (
    <AbsoluteFill style={{ backgroundColor: CHAR }}>
      <Specimen id='claude-motion-design' trim={2} left={810} top={150} width={1040} style={{ opacity: slide, translate: `${(1 - slide) * 140}px 0px` }} />
      <Line size={30} weight={600} color={DIM} left={810} top={828} delay={12}>claude-motion-design — ボタンから画面へ、形を引き継ぐ</Line>
      <Line size={96} left={64} top={150} delay={2}>スキルも、</Line>
      <Line size={96} left={64} top={277} delay={6}>作例で見る。</Line>
      <div style={{ position: 'absolute', left: 70, top: 452, display: 'flex', alignItems: 'flex-start', gap: 36, opacity: interpolate(frame, [14, 20], [0, 1], CLAMP) }}>
        <Stat value={Math.round(8 * count)} label='スキル・資料' color={MINT} />
        <div style={{ fontSize: 72, lineHeight: '150px', fontWeight: 600, color: DIM }}>+</div>
        <Stat value={Math.round(23 * count)} label='エンジン・ツール' color={IVORY} />
      </div>
      <Line size={30} weight={600} color={DIM} left={70} top={720} delay={24}>スキルは、制作判断を支えるルール。</Line>
      <AbsoluteFill style={{ backgroundColor: DEEP, translate: `${wipe}% 0px` }} />
    </AbsoluteFill>
  );
};

type MontageCutProps = { readonly id: string; readonly name: string; readonly trim: number };

// 07 · one half-beat flash in the finale montage; the frame kicks on every cut.
const MontageCut: React.FC<MontageCutProps> = ({ id, name, trim }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Specimen id={id} trim={trim} left={400} top={70} width={1120} style={{ scale: `${interpolate(frame, [0, 6], [1.025, 1], { ...CLAMP, easing: EASE_OUT })}` }} />
      <div style={{ position: 'absolute', left: 70, top: 118, fontSize: 38, fontWeight: 600, color: IVORY }}>{name}</div>
    </AbsoluteFill>
  );
};

// 07 · bars 17–18 · Eight specimens at two per beat under the three-step promise.
const Montage: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <AbsoluteFill style={{ backgroundColor: DEEP }}>
      <div style={{ position: 'absolute', inset: 0, opacity: enter, transformOrigin: '960px 420px', scale: `${0.92 + 0.08 * enter}` }}>
        <Sequence name='Montage 1 · Motion' from={0} durationInFrames={15} premountFor={30}><MontageCut id='motion' name='Motion' trim={3.5} /></Sequence>
        <Sequence name='Montage 2 · Cobe' from={15} durationInFrames={15} premountFor={30}><MontageCut id='cobe' name='Cobe' trim={3.5} /></Sequence>
        <Sequence name='Montage 3 · D3' from={30} durationInFrames={15} premountFor={30}><MontageCut id='d3' name='D3' trim={3.5} /></Sequence>
        <Sequence name='Montage 4 · Manim' from={45} durationInFrames={15} premountFor={30}><MontageCut id='manim' name='Manim' trim={4.5} /></Sequence>
        <Sequence name='Montage 5 · HyperFrames' from={60} durationInFrames={15} premountFor={30}><MontageCut id='hyperframes' name='HyperFrames' trim={3.5} /></Sequence>
        <Sequence name='Montage 6 · Fabric.js' from={75} durationInFrames={15} premountFor={30}><MontageCut id='fabric' name='Fabric.js' trim={3.5} /></Sequence>
        <Sequence name='Montage 7 · Lottie' from={90} durationInFrames={15} premountFor={30}><MontageCut id='lottie' name='Lottie' trim={3.5} /></Sequence>
        <Sequence name='Montage 8 · canvas-confetti' from={105} durationInFrames={15} premountFor={30}><MontageCut id='confetti' name='canvas-confetti' trim={1.6} /></Sequence>
      </div>
      <Line font={MONO} weight={400} size={30} color={DIM} left={70} top={70}>SPECIMEN</Line>
      <Line size={100} left={225} top={830} delay={4}>見て、</Line>
      <Line size={100} left={519} top={830} delay={34}>選んで、</Line>
      <Line size={100} left={911} top={830} delay={64}>つくりはじめる。</Line>
      <div style={{ position: 'absolute', left: 911, top: 968, width: 700, height: 8, backgroundColor: CORAL, transformOrigin: '0% 50%', scale: `${interpolate(frame, [76, 92], [0, 1], { ...CLAMP, easing: EASE_OUT })} 1` }} />
    </AbsoluteFill>
  );
};

// 08 · bars 19–20 · An ivory panel rises one beat early; the 31-dot grid echoes the catalog wall and settles.
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = interpolate(frame, [0, 13], [100, 0], { ...CLAMP, easing: EASE_IN_OUT });
  const rule = interpolate(frame, [8, 28], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <AbsoluteFill style={{ backgroundColor: IVORY, translate: `0px ${rise}%` }}>
      <div style={{ position: 'absolute', left: 70, top: 70, width: 64, height: 64, borderRadius: 14, backgroundColor: CHAR }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 56, fontSize: 40, lineHeight: '60px', fontWeight: 800, color: IVORY, textAlign: 'center' }}>m</div>
        <div style={{ position: 'absolute', right: 6, top: 2, fontSize: 22, fontWeight: 800, color: MINT }}>↗</div>
      </div>
      <Line size={30} weight={600} color={INK} left={154} top={82} delay={6}>StudioYebisu ／ 日本語ガイド</Line>
      <Line font={MONO} weight={400} size={30} color={MUTED} left={1364} top={82} delay={8}>31 SPECIMENS · 6 CATEGORIES</Line>
      <Line size={104} color={INK} left={64} top={226} delay={4}>Claude モーショングラフィック</Line>
      <Line size={104} color={INK} left={64} top={364} delay={6}>制作ガイド</Line>
      <Line size={54} color={EMERALD} left={70} top={526} delay={9}>動く作例から、次の一本へ。</Line>
      <div style={{ position: 'absolute', left: 70, top: 650, width: 1780, height: 2, backgroundColor: INK, opacity: 0.16, transformOrigin: '0% 50%', scale: `${rule} 1` }} />
      <div style={{ position: 'absolute', left: 70, top: 690, width: 10, height: 160, backgroundColor: CORAL, transformOrigin: '50% 0%', scale: `1 ${rule}` }} />
      <Line size={64} weight={600} color={INK} left={104} top={684} delay={8}>studio-yebisu.github.io/</Line>
      <Line size={64} weight={600} color={INK} left={104} top={768} delay={10}>awesome-claude-motion-design-ja</Line>
      <Line size={30} weight={600} color={MUTED} left={70} top={940} delay={12}>無料で読める、非公式の日本語ガイド</Line>
      {Array.from({ length: 32 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 1530 + (i % 8) * 42,
            top: 704 + Math.floor(i / 8) * 42,
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: i === 31 ? CORAL : EMERALD,
            scale: `${spring({ frame: frame - 18 - Math.hypot(i % 8, 3 - Math.floor(i / 8)) * 2.4, fps, config: { damping: 12, stiffness: 160 } })}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

type PromoFilmProps = { readonly withMusic?: boolean };

export const PromoFilm: React.FC<PromoFilmProps> = ({ withMusic = false }) => (
  <AbsoluteFill style={{ backgroundColor: CHAR, fontFamily: JP }}>
    <Sequence name='01 Hook · その動き、どうつくる？ (bars 1–2)' from={0} durationInFrames={120} premountFor={30}>
      <Hook />
    </Sequence>
    <Sequence name='02 Catalog · 31本の、動く作例。 (bars 3–4)' from={120} durationInFrames={120} premountFor={30}>
      <Catalog />
    </Sequence>
    <Sequence name='03 Reel · five expressions (bars 5–8)' from={240} durationInFrames={240} premountFor={30}>
      <Reel />
    </Sequence>
    <Sequence name='04 Categories · つくりたいものから、選ぶ。 (bars 9–10)' from={480} durationInFrames={120} premountFor={30}>
      <Categories />
    </Sequence>
    <Sequence name='05 Search · 探して、すぐ確かめる。 (bars 11–12)' from={600} durationInFrames={120} premountFor={30}>
      <SearchAndExpand />
    </Sequence>
    <Sequence name='06a GIF + code · GIFも、制作コードも。 (bars 13–14)' from={720} durationInFrames={120} premountFor={30}>
      <GifAndCode />
    </Sequence>
    <Sequence name='06b Skills · スキルも、作例で見る。 (bars 15–16)' from={840} durationInFrames={120} premountFor={30}>
      <SkillsAndTools />
    </Sequence>
    <Sequence name='07 Montage · 見て、選んで、つくりはじめる。 (bars 17–18)' from={960} durationInFrames={120} premountFor={30}>
      <Montage />
    </Sequence>
    <Sequence name='08 Outro · title + URL (bars 19–20)' from={1065} durationInFrames={135} premountFor={30}>
      <Outro />
    </Sequence>
    {withMusic ? <Audio src={staticFile('promo/music.wav')} volume={(f) => interpolate(f, [1140, 1200], [1, 0], { ...CLAMP, easing: EASE_IN })} /> : null}
  </AbsoluteFill>
);
