import type React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Release Notes Film — an 8 s loop. The title card docks to the top, three notes are set
// one by one under a travelling accent bar, the catalog count lands, then everything
// folds back into the title card so the first and last frames match.

const PAPER = '#f2efe8';
const INK = '#17150f';
const MUTED = '#5f594e';
const ACCENT = '#0f7a63';
const SANS = `'Inter Tight', 'Inter', system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const EASE_IN = Easing.bezier(0.64, 0, 0.78, 0);

type NoteRowProps = {
  readonly top: number;
  readonly tag: string;
  readonly title: string;
  readonly detail: string;
  readonly exitAt: number;
  readonly dimAt?: number;
  readonly undimAt?: number;
};

const NoteRow: React.FC<NoteRowProps> = ({ top, tag, title, detail, exitAt, dimAt, undimAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: Math.round(0.8 * fps) });

  return (
    <div style={{ position: 'absolute', left: 56, top, width: 584, height: 80 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: 2,
          backgroundColor: INK,
          opacity: 0.18,
          transformOrigin: '0% 50%',
          scale: `${interpolate(frame, [0, 0.6 * fps, exitAt, exitAt + 0.4 * fps], [0, 1, 1, 0], { ...CLAMP, easing: EASE_IN_OUT })} 1`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 12,
          width: '100%',
          height: 68,
          overflow: 'hidden',
          opacity:
            dimAt === undefined || undimAt === undefined
              ? 1
              : interpolate(frame, [dimAt, dimAt + 0.3 * fps, undimAt, undimAt + 0.3 * fps], [1, 0.4, 0.4, 1], { ...CLAMP, easing: EASE_IN_OUT }),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 24,
            translate: `0px ${interpolate(enter, [0, 1], [72, 0]) + interpolate(frame, [exitAt, exitAt + 0.45 * fps], [0, -72], { ...CLAMP, easing: EASE_IN })}px`,
          }}
        >
          <div
            style={{
              flex: '0 0 132px',
              marginTop: 4,
              padding: '3px 0',
              border: `1.5px solid ${INK}`,
              borderRadius: 4,
              fontFamily: MONO,
              fontSize: 20,
              lineHeight: '24px',
              letterSpacing: '0.04em',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            {tag}
          </div>
          <div>
            <div style={{ fontSize: 30, lineHeight: '34px', fontWeight: 650, letterSpacing: '-0.02em' }}>{title}</div>
            <div style={{ marginTop: 2, fontSize: 22, lineHeight: '28px', color: MUTED }}>{detail}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

type CatalogCountProps = {
  readonly value: number;
  readonly exitAt: number;
};

const CatalogCount: React.FC<CatalogCountProps> = ({ value, exitAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: 'absolute',
        left: 680,
        top: 196,
        width: 240,
        height: 244,
        opacity: interpolate(frame, [0, 0.35 * fps, exitAt, exitAt + 0.4 * fps], [0, 1, 1, 0], CLAMP),
        translate: `0px ${interpolate(frame, [0, 0.6 * fps, exitAt, exitAt + 0.5 * fps], [24, 0, 0, -24], { ...CLAMP, easing: EASE_OUT })}px`,
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 20, lineHeight: '24px', letterSpacing: '0.04em', textTransform: 'uppercase', color: MUTED }}>
        In the catalog
      </div>
      <div style={{ marginTop: 12, fontSize: 100, lineHeight: '100px', fontWeight: 700, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums' }}>
        {Math.round(interpolate(frame, [0.15 * fps, 1.15 * fps], [0, value], { ...CLAMP, easing: EASE_OUT }))}
      </div>
      <div
        style={{
          marginTop: 10,
          height: 6,
          backgroundColor: ACCENT,
          transformOrigin: '0% 50%',
          scale: `${interpolate(frame, [0.6 * fps, 1.3 * fps, exitAt, exitAt + 0.4 * fps], [0, 1, 1, 0], { ...CLAMP, easing: EASE_OUT })} 1`,
        }}
      />
      <div style={{ marginTop: 16, fontSize: 24, lineHeight: '30px', color: MUTED }}>motion design entries</div>
    </div>
  );
};

export const ReleaseNotes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  // Designed on a 960x600 stage; fitted to whatever size the Root registers.
  const fit = Math.min(width / 960, height / 600);

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <div
        style={{
          position: 'absolute',
          left: (width - 960 * fit) / 2,
          top: (height - 600 * fit) / 2,
          width: 960,
          height: 600,
          scale: fit,
          transformOrigin: '0 0',
          color: INK,
          fontFamily: SANS,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 190,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: MONO,
            fontSize: 20,
            lineHeight: '24px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: MUTED,
            translate: `0px ${interpolate(frame, [0.5 * fps, 1.2 * fps, 6.6 * fps, 7.3 * fps], [0, -132, -132, 0], { ...CLAMP, easing: EASE_IN_OUT })}px`,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: ACCENT,
              rotate: `${interpolate(frame, [0.5 * fps, 1.2 * fps, 6.6 * fps, 7.3 * fps], [0, 45, 45, 0], { ...CLAMP, easing: EASE_IN_OUT })}deg`,
            }}
          />
          Changelog · Demo build
        </div>

        <div
          style={{
            position: 'absolute',
            left: 36,
            top: 222,
            fontSize: 96,
            lineHeight: '96px',
            fontWeight: 700,
            letterSpacing: '-0.045em',
            whiteSpace: 'nowrap',
            transformOrigin: '0% 0%',
            translate: `0px ${interpolate(frame, [0.5 * fps, 1.2 * fps, 6.6 * fps, 7.3 * fps], [0, -132, -132, 0], { ...CLAMP, easing: EASE_IN_OUT })}px`,
            scale: interpolate(frame, [0.5 * fps, 1.2 * fps, 6.6 * fps, 7.3 * fps], [1, 0.667, 0.667, 1], { ...CLAMP, easing: EASE_IN_OUT }),
          }}
        >
          Release notes
        </div>

        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 334,
            fontSize: 26,
            lineHeight: '32px',
            color: MUTED,
            opacity: interpolate(frame, [0.3 * fps, 0.6 * fps, 7.0 * fps, 7.4 * fps], [1, 0, 0, 1], CLAMP),
            translate: `0px ${interpolate(frame, [0.3 * fps, 0.6 * fps, 7.0 * fps, 7.4 * fps], [0, -12, -12, 0], { ...CLAMP, easing: EASE_IN_OUT })}px`,
          }}
        >
          What changed in the motion catalog.
        </div>

        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 0,
            width: 4,
            height: 60,
            backgroundColor: ACCENT,
            transformOrigin: '50% 0%',
            translate: `0px ${interpolate(frame, [1.9 * fps, 2.25 * fps, 2.8 * fps, 3.15 * fps], [208, 292, 292, 376], { ...CLAMP, easing: EASE_IN_OUT })}px`,
            scale: `1 ${interpolate(frame, [1.0 * fps, 1.35 * fps, 3.8 * fps, 4.1 * fps], [0, 1, 1, 0], { ...CLAMP, easing: EASE_IN_OUT })}`,
          }}
        />

        <Sequence name='Note · Added' from={Math.round(1.0 * fps)} durationInFrames={Math.round(5.8 * fps)} premountFor={fps}>
          <NoteRow
            top={196}
            tag='Added'
            title='Specimen plates'
            detail='Seekable previews for every library.'
            dimAt={0.9 * fps}
            undimAt={2.8 * fps}
            exitAt={5.2 * fps}
          />
        </Sequence>

        <Sequence name='Note · Improved' from={Math.round(1.9 * fps)} durationInFrames={Math.round(4.8 * fps)} premountFor={fps}>
          <NoteRow
            top={280}
            tag='Improved'
            title='Camera movement'
            detail='Dolly in, then return. Fixed heading.'
            dimAt={0.9 * fps}
            undimAt={1.9 * fps}
            exitAt={4.15 * fps}
          />
        </Sequence>

        <Sequence name='Note · Fixed' from={Math.round(2.8 * fps)} durationInFrames={Math.round(3.7 * fps)} premountFor={fps}>
          <NoteRow
            top={364}
            tag='Fixed'
            title='Frame-accurate seeking'
            detail='Same frame, same pixels, every render.'
            exitAt={3.1 * fps}
          />
        </Sequence>

        <Sequence name='Catalog count' from={Math.round(3.6 * fps)} durationInFrames={Math.round(2.9 * fps)} premountFor={fps}>
          <CatalogCount value={31} exitAt={2.25 * fps} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
