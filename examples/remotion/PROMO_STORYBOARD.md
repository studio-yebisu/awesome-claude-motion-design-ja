# Promo Film — storyboard

`src/PromoFilm.tsx` · export `PromoFilm` · props `{ withMusic?: boolean }`
1920×1080 · 30 fps · 1200 frames (40 s) · no voiceover · Japanese on clearly separated type bands.

The film runs on a **120 BPM 4/4 grid: 1 bar = 2 s = 60 frames, 20 bars**. Every major cut is on a bar line. Dark (charcoal), ivory and deep-emerald sections alternate. Each scene owns the shape that carries it into the next scene, so there are no generic crossfades.

Fonts: `'Inter Tight', 'Yu Gothic', 'YuGothic', 'Meiryo'` (Latin uses Inter Tight 600/800, already loaded in `index.ts`; Japanese uses Yu Gothic). Mono labels use JetBrains Mono 400.
Palette: ivory `#f5f2ec`, charcoal `#1a1916`, emerald `#0f7a63` / mint `#5fd3a8` on dark, deep emerald `#0b5546`, coral `#ee6c56` (used sparingly: the ALL tile, the underline, the URL bar, the last dot). Category colours come from the site.

Clips: `public/promo/clips/{id}.mp4` (960×600, 8 s). They sit in an 8:5 frame with `objectFit="contain"` and are always `muted`. All trims stay inside 0–8 s, so no clip runs out or freezes. Posters (`promo/posters/{id}.webp`) are used only on the catalog wall.

| # | Time (frames) | Bars | Ground | Primary caption | Clips (trim → out) | What happens / why |
|---|---|---|---|---|---|---|
| 01 Hook | 0:00–0:04 (0–120) | 1–2 | charcoal | その動き、／どうつくる？ (100px). Kicker CLAUDE × MOTION DESIGN. Label: Three.js — 360本の柱が、31の形になる | `three` 2.0 → 6.0 s | A real specimen is playing at frame 0: the frame opens vertically with a slow push, then the question is set. At 3.5 s an ivory iris opens from the centre of the 3D frame. |
| 02 Catalog | 0:04–0:08 (120–240) | 3–4 | ivory | **31** 本の、動く作例。 Sub: スキル・エンジン・ライブラリを、実際の映像で比べる。 | posters of all 31 + coral "ALL ↗" tile | An 8×4 wall of posters ripples out from the centre. The giant emerald counter is the number of tiles that have landed, so it reaches 31 when the wall is full. A charcoal slab rises from the bottom. |
| 03 Reel | 0:08–0:16 (240–480) | 5–8 | charcoal | 文字を組む。／粒を集める。／光を流す。／データを立てる。／線を描く。 (96px) + library name + specimen title | `gsap` 2.5→4.5 (240–300) · `pixi` 2.6→4.6 (300–360) · `twgl` 3.0→5.0 (360–420) · `deck` 3.4→4.4 (420–450) · `anime` 3.6→4.6 (450–480) | Five expressions: type, particles, shader, data, line. Each cut opens with a category-coloured slab sliding off the frame. The cadence doubles in bar 8. Exit: six ivory columns drop in, one per frame, foreshadowing the six categories. |
| 04 Categories | 0:16–0:20 (480–600) | 9–10 | ivory | つくりたいものから、／選ぶ。 Sub: 6カテゴリ・31件を、日本語で比較。 | — | Six bars in the site colours, with heights equal to the real counts (8/7/4/5/4/3), labelled 制作スキル・動画・書き出し・UI・文字・3D・シェーダー・2D・ベクター・データ・図解. At 2.1 s the other bars dim and 3D stays bright, which sets up the search. The bars fall away. |
| 05 Search | 0:20–0:24 (600–720) | 11–12 | ivory → charcoal | 探して、／すぐ確かめる。 Sub: 検索・絞り込み・拡大再生 | `three`, `fiber`, `drei` 2.0 → 6.0 s | Mock UI built from the site's idiom: "3D" is typed, the 3D・シェーダー 5 chip activates, and three live result cards appear. The Fiber card expands into the lightbox (shared-element move). Its title and the GIF ↗ / 制作コード ↗ links appear. The lightbox backdrop then becomes the charcoal of the next scene. |
| 06a GIF + code | 0:24–0:28 (720–840) | 13–14 | charcoal | GIFも、／制作コードも。 Pills: GIF ↗ · 制作コード ↗ · 出典・ライセンス ↗ | `remotion-skills` 2.5 → 6.5 s | The pills are "pressed" on beats 0.73 / 1.13 / 1.53 s. Real lines from `ReleaseNotes.tsx` type into a code panel. The scene slides out to the left. |
| 06b Skills | 0:28–0:32 (840–960) | 15–16 | charcoal | スキルも、／作例で見る。 Stats: **8** スキル・資料 + **23** エンジン・ツール. Line: スキルは、制作判断を支えるルール。 | `claude-motion-design` 2.0 → 6.0 s | The applied-skill specimen slides in from the right and the counters roll. A deep-emerald wipe arrives from the left on the bar line. |
| 07 Montage | 0:32–0:36 (960–1080) | 17–18 | deep emerald | 見て、 → 選んで、 → つくりはじめる。 (100px, one phrase per bar-half, coral underline) | `motion` 3.5, `cobe` 3.5, `d3` 3.5, `manim` 4.5, `hyperframes` 3.5, `fabric` 3.5, `lottie` 3.5, `confetti` 1.6 (each 0.5 s) | The climax: eight specimens at two per beat, with a scale kick on every cut. The library name is shown top-left. The phrase lands on beats 0.13 / 1.13 / 2.13 s, and the burst from `confetti` closes the run. |
| 08 Outro | 0:35.5–0:40 (1065–1200) | 19–20 | ivory | Claude モーショングラフィック／制作ガイド (104px) · CTA 動く作例から、次の一本へ。 · URL studio-yebisu.github.io/ ／ awesome-claude-motion-design-ja (64px) · 無料で読める、非公式の日本語ガイド · 31 SPECIMENS · 6 CATEGORIES | — | An ivory panel rises one beat early (frames 1065–1078), so the title and URL are readable for the whole final 4 s. Every line has fully landed by about 1090. A 31+1 dot grid echoes the catalog wall and settles by about 1150, and the last 2 s are a still hold that suits a ringing final chord. |

## Copy rules kept
- The guide is described as a free, unofficial Japanese community guide. No Anthropic sponsorship, no benchmark, and no license promise for external tools (the film only says 出典・ライセンス can be reached).
- The specimens are credited by library or skill name only. The film never says Opus authored every specimen. Rive is not used.

## Music timing (120 BPM, 20 bars)
| Bars | Time | Music | Picture sync |
|---|---|---|---|
| 1–2 | 0–4 s | Filtered pluck arpeggio, soft kick from bar 1 | Hook. Iris at 3.5 s rides a short riser into the downbeat of bar 3 |
| 3–4 | 4–8 s | Full kick + bass enter | Catalog wall ripple on the bar-3 downbeat |
| 5–8 | 8–16 s | Groove with hats; bar 8 adds a fill | Reel cuts on every bar, every half-bar in bar 8 |
| 9–12 | 16–24 s | Groove, lighter (drop the hats in bar 9) | Categories bars, typing in search, lightbox expand on beat 2 of bar 12 |
| 13–16 | 24–32 s | Second groove section, a counter-melody on the pluck | Pill presses on beats; wipe on the bar-17 downbeat |
| 17–18 | 32–36 s | Peak: all layers, a short accent on each phrase | Two cuts per beat |
| 19–20 | 36–40 s | Resolve: drums out, bass + final chord ring out naturally | Outro hold |

Audio: with `withMusic`, `<Audio src={staticFile('promo/music.wav')}>` plays from frame 0 and fades gently over the last 2 s (frames 1140–1200). Specimen clips are always muted. If the Suno track drifts from 120 BPM, nudge it in post (time-stretch or re-align to the bar-3 downbeat). Alternatively, render with `withMusic=false` and mux the soundtrack at the final stage. The picture works muted.
