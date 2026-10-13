# Claude モーショングラフィック制作ガイド

**企画・構成・編集・制作：Studio Yebisu**

Studio Yebisuのオリジナル企画。Claude Opus 5.5と制作スキルを活用し、31のスキル・ツールそれぞれに動く作例を制作しました。動画・GIF・制作コードを見ながら、つくりたい表現に合う道具を選べる日本語ガイドです。

**[サイトを開く](https://studio-yebisu.github.io/awesome-claude-motion-design-ja/)** · **[31本の作例を見る](https://studio-yebisu.github.io/awesome-claude-motion-design-ja/projects.html)** · **[スタックの組み方](https://studio-yebisu.github.io/awesome-claude-motion-design-ja/guide.html)**

![Studio YebisuのClaudeモーショングラフィック制作ガイド](assets/og-card.png)

## 動く作例から、次の一本へ。

- **31本のオリジナル作例**：各スキル・ツールを使い、文字演出、UI、3D、2D、図解などを制作。拡大再生して動きを確かめられます。
- **GIFと制作コード**：気に入った表現を、その場で見比べて実装へ進めます。
- **6カテゴリと4つの制作ルート**：用途、必要な環境、組み合わせから道具を選べます。
- **40秒の紹介動画**：このガイドのために構成・演出し、オリジナル作例とSunoで制作した楽曲を編集。[制作コード・構成表](examples/remotion/PROMO_README.md)も公開しています。

## まず何をつくるか

| つくりたいもの | スタックの入口 | 詳細 |
| --- | --- | --- |
| 短い商品紹介・文字演出 | HyperFrames + 公式制作スキル + HTML | [HTML動画のルート](https://studio-yebisu.github.io/awesome-claude-motion-design-ja/guide.html#html) |
| 差し替えて使う動画テンプレート | Remotion + 公式Agent Skills + React | [React動画のルート](https://studio-yebisu.github.io/awesome-claude-motion-design-ja/guide.html#react) |
| 触れるUI・製品サイト | Motion / GSAP + Emil Kowalski Skills | [Webのルート](https://studio-yebisu.github.io/awesome-claude-motion-design-ja/guide.html#web) |
| 数式・仕組みの解説 | Manim / Motion Canvas + 場面の構成表 | [解説動画のルート](https://studio-yebisu.github.io/awesome-claude-motion-design-ja/guide.html#explain) |

## 制作について

本ガイドはStudio Yebisuのアイデアから始まった制作プロジェクトです。企画・構成・ツールの選定・編集・制作ディレクションをStudio Yebisuが担い、Claude Opus 5.5、Codex、制作スキルを活用して実装・レンダリング・仕上げを進めました。掲載する作例動画と紹介動画は、この企画のために制作したオリジナル作品です。

作品をつくるときは、伝えたいことと完成形を決め、エージェントに構成とコードを依頼します。制作スキルがデザインや実装の判断を支え、ブラウザやレンダラーがフレームを描き、動画処理で音と映像を仕上げます。

[作例の制作記録](docs/作例の制作記録.md) · [制作コードと再現手順](examples/README.md) · [制作スタック](docs/制作スタック.md)

## スキル・ツール一覧


### 制作スキル・事例（8件）

| スキル・ツール | 使いどころ | ライセンス |
| --- | --- | --- |
| [Remotion Agent Skills](https://github.com/remotion-dev/skills) | Reactで動画をつくるときの基本セット。 | [独立LICENSE未確認](https://github.com/remotion-dev/skills/blob/7ba4dcf8ebe1626b00baa41e1f2478113719b60b/README.md) |
| [Emil Kowalski Skills](https://github.com/emilkowalski/skills) | UIデモの動きや、操作に対する反応を磨く。 | [MIT](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/LICENSE) |
| [Motion Graphics Skill Pack](https://github.com/charlie947/motion-graphics-skills) | 短い告知動画を、ブランドに沿った構成でつくる。 | [MIT](https://github.com/charlie947/motion-graphics-skills/blob/229022ebca76972e119e36ada23a1648d51665ab/LICENSE) |
| [claude-motion](https://github.com/whaleyxbt/claude-motion) | 映像と音を同じ時刻表に合わせる。Webシミュレーションの動画化にも。 | [MIT](https://github.com/whaleyxbt/claude-motion/blob/e627941543d9988b155dc610bb9cc0115a5e365e/LICENSE) |
| [claude-motion-design](https://github.com/howseen-ai/claude-motion-design) | 商品紹介やUIの変形を、音のタイミングに合わせてつくる。 | [MIT](https://github.com/howseen-ai/claude-motion-design/blob/3d90d349ef3fdde9b7e89de4df4a2159c9e8697f/LICENSE) |
| [/motion for Claude Code](https://github.com/abhimahamkali/claude-motion-skill) | 比喩や図形で伝える短い解説動画。 | [LICENSE未確認](https://github.com/abhimahamkali/claude-motion-skill/blob/37d44b5d2db8e28c4ebf011cb8f1bd1e260ac09c/README.md) |
| [iart.ai Motion Skills](https://github.com/iart-ai/motion-skills) | つくりたい表現に合わせて、必要なパックを選ぶ。 | [MIT（索引）](https://github.com/iart-ai/motion-skills/blob/4a9822375b589294aa369fde44205c62dfcf9c27/LICENSE) |
| [Opus 5.5 Video Prompts](https://github.com/apimodels/claude-opus-5-5-video-prompts) | 良い制作指示の粒度や、映像ごとの技術選択を調べる。 | [CC BY 4.0（編集資料）](https://github.com/apimodels/claude-opus-5-5-video-prompts/blob/383335d1ed1a6a6d84b772d7c802ca0d221f6410/LICENSE) |

### 動画制作・書き出し（7件）

| スキル・ツール | 使いどころ | ライセンス |
| --- | --- | --- |
| [HyperFrames](https://github.com/heygen-com/hyperframes) | HTMLで組む商品紹介、文字演出、SNS動画。 | [Apache-2.0](https://github.com/heygen-com/hyperframes/blob/fbbc4e88c59c01bfec69368a9a587d3438a7d32a/LICENSE) |
| [Remotion](https://github.com/remotion-dev/remotion) | 再利用する動画テンプレート、字幕、データを差し替える量産。 | [Remotion License](https://github.com/remotion-dev/remotion/blob/d5f455390933ab7a48d6ca79a5f4f0223234a802/LICENSE.md) |
| [Motion Canvas](https://github.com/motion-canvas/motion-canvas) | 仕組みを順番に見せる図解や、技術説明の動画。 | [MIT](https://github.com/motion-canvas/motion-canvas/blob/7b91435c301d530351dcf5ebb91dd139c002e405/LICENSE) |
| [FFmpeg](https://github.com/FFmpeg/FFmpeg) | レンダラーの出力をMP4にし、音声を合わせて納品する。 | [LGPL／GPL（構成による）](https://github.com/FFmpeg/FFmpeg/blob/6ef3b1ba966233a0964bcc4aa1c2e20d014a5052/LICENSE.md) |
| [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) | ファイルを利用者のブラウザ内で処理するWebツール。 | [MIT（wrapper）＋coreの条件](https://ffmpegwasm.netlify.app/docs/faq/#what-is-the-license-of-ffmpegwasm) |
| [Mediabunny](https://github.com/Vanilagy/mediabunny) | ブラウザで動く編集・書き出し機能を実装する。 | [MPL-2.0](https://github.com/Vanilagy/mediabunny/blob/cc108b3b492d1e00aa976586b6d3f344a0bd178d/LICENSE) |
| [Playwright](https://github.com/microsoft/playwright) | seek(t)で描いた各フレームの取得と、表示崩れの検査。 | [Apache-2.0](https://github.com/microsoft/playwright/blob/d9f2fd3e2232ace8e317a84eda6cb86e25bcf49c/LICENSE) |

### UI・文字のアニメーション（4件）

| スキル・ツール | 使いどころ | ライセンス |
| --- | --- | --- |
| [Motion](https://github.com/motiondivision/motion) | 操作に応じるUI、画面の切り替え、製品デモの部品。 | [MIT](https://github.com/motiondivision/motion/blob/e6bf03ead39cae7a2c5f8fe902ce8a9c1a9a22e8/LICENSE.md) |
| [GSAP](https://github.com/greensock/GSAP) | 文字演出や複数要素の連動。HTML動画ではpaused timelineの時刻指定が入口。 | [GSAP独自ライセンス](https://gsap.com/community/standard-license/) |
| [Anime.js](https://github.com/juliangarnier/anime) | ロゴの線、図形の変化、複数の文字の時間差演出。 | [MIT](https://github.com/juliangarnier/anime/blob/01b81be1df6843ccfe0a71c0699a746bf740dd77/LICENSE.md) |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | 達成、完了、祝福を短く伝える演出。 | [ISC](https://github.com/catdad/canvas-confetti/blob/20eebad51dde793070c373d594099a7ed8d96e22/LICENSE) |

### 3D・シェーダー（5件）

| スキル・ツール | 使いどころ | ライセンス |
| --- | --- | --- |
| [Three.js](https://github.com/mrdoob/three.js) | 立体ロゴ、製品の回転、奥行きのある文字や空間。 | [MIT](https://github.com/mrdoob/three.js/blob/2a8cd874803effdc99cf2db0cd0ff2f683d69389/LICENSE) |
| [React Three Fiber](https://github.com/pmndrs/react-three-fiber) | ReactのUIと3Dシーンを同じプロジェクトで管理する。 | [MIT](https://github.com/pmndrs/react-three-fiber/blob/9e53355ce499ea518ac3729de7fd4dcc06d8cdb9/LICENSE) |
| [Drei](https://github.com/pmndrs/drei) | 3D製品ビューの環境や操作、文字の配置を組む。 | [MIT](https://github.com/pmndrs/drei/blob/bf6f4addf47467d3885de272d94ca5127f6ef68f/LICENSE) |
| [Cobe](https://github.com/shuding/cobe) | 拠点、国際展開、ネットワークを伝える小さな地球儀。 | [MIT](https://github.com/shuding/cobe/blob/7e94076fa8c38707f4c9cd114ff4f7c5c880971e/LICENSE) |
| [TWGL.js](https://github.com/greggman/twgl.js) | 独自のシェーダーや背景効果を、小さく実装する。 | [MIT](https://github.com/greggman/twgl.js/blob/aa33c0aa5b095e57b9a5cde0cf241e66a6c95f2e/LICENSE.md) |

### 2D・ベクター（4件）

| スキル・ツール | 使いどころ | ライセンス |
| --- | --- | --- |
| [Fabric.js](https://github.com/fabricjs/fabric.js) | テキストや図形を動かす編集ツール、図解の部品管理。 | [MIT](https://github.com/fabricjs/fabric.js/blob/54f050648cb67f7066b108f63cf1824039860d92/LICENSE) |
| [Rive Runtimes](https://github.com/rive-app/rive-runtime) | 入力や状態に応じて変わるキャラクター、ボタン、案内。 | [MIT（runtime）](https://github.com/rive-app/rive-runtime/blob/daf55385b71fb861b2a1ae2930ae4492832d5db5/LICENSE) |
| [Lottie Web](https://github.com/airbnb/lottie-web) | 既存のロゴ、アイコン、イラストの動きを画面や動画へ組み込む。 | [MIT](https://github.com/airbnb/lottie-web/blob/bede03d25d232826e0c9dca1733d542d8a7754fb/LICENSE.md) |
| [PixiJS](https://github.com/pixijs/pixijs) | 粒子、キャラクター、要素の多い2Dシーン。 | [MIT](https://github.com/pixijs/pixijs/blob/65552017d23255c1442a7d4ac7f0d49e3225fb1d/LICENSE) |

### データ・図解（3件）

| スキル・ツール | 使いどころ | ライセンス |
| --- | --- | --- |
| [deck.gl](https://github.com/visgl/deck.gl) | 地図上の流れ、移動、分布を見せるデータ表現。 | [MIT](https://github.com/visgl/deck.gl/blob/d9e395c935d962740e4b6debb7b63e1b4391b1b5/LICENSE) |
| [D3](https://github.com/d3/d3) | 数値が変わるグラフ、統計の比較、独自の図解。 | [ISC](https://github.com/d3/d3/blob/ca958d45217b4c15332d971b935451a6d4c978f4/LICENSE) |
| [Manim Community](https://github.com/ManimCommunity/manim) | 数学、アルゴリズム、仕組みの解説を動画にする。 | [MIT](https://github.com/ManimCommunity/manim/blob/a6d5cc02b430fb57d22add51236b6406fbf19d91/LICENSE) |

## ツールの選び方と利用条件

各項目に用途、導入環境、Claudeとの組み合わせ、READMEとライセンスへのリンクを掲載しています。Remotion・GSAPの独自条件や、スキル・素材の利用条件は導入前に確認できます。

[掲載ツールの選び方](docs/調査ノート.md) · [出典とライセンス](docs/出典とライセンス.md)

使用した版・動画ファイル・制作コードは[data/preview-production.json](data/preview-production.json)、リポジトリの取得時点とstar数は[data/verification.json](data/verification.json)に記録しています。素材の帰属は各作例の制作記録に掲載しています。

## ローカルで表示する

Python 3でサイトを再生成・表示できます。

```text
python scripts/build_site.py
python scripts/check_site.py
python -u -m http.server 0 --bind 127.0.0.1
```

ターミナルに表示されたURLを開きます。公開先はGitHub Pagesの`main`ブランチ、ルートディレクトリです。

編集対象は[data/curation.json](data/curation.json)、[templates](templates/)、[assets](assets/)です。`index.html`、`projects.html`、`guide.html`、`data/projects.json`、このREADMEはビルド生成物です。[更新への参加方法](CONTRIBUTING.md)も用意しています。

一次資料の更新には[scripts/collect_sources.py](scripts/collect_sources.py)を使います。`--evidence-dir`には公開リポジトリ外の保存先を指定してください。

## Studio Yebisuの関連ガイド

[AIスライド制作ガイド](https://studio-yebisu.github.io/awesome-codex-ppt-skills-ja/)

## ライセンス

本ガイドのオリジナル文章、編集データ、制作コード、図版は[MIT](LICENSE)で公開しています。使用したライブラリ・フォント・素材・楽曲にはそれぞれの利用条件が適用されます。詳細は[出典とライセンス](docs/出典とライセンス.md)をご覧ください。
