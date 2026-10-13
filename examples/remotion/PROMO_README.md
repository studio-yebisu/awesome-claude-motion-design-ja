# ガイドの紹介動画

制作ガイドを紹介するデモ映像（1920×1080・30 fps・40秒）。31本の作例と各ツールの特徴をダイジェストで確認できます。

Claude Code 2.1.287を `claude --model claude-opus-5-5` で実行し、Opus 5.5が [PromoFilm.tsx](src/PromoFilm.tsx)、[構成表](PROMO_STORYBOARD.md)、[音楽の設計案](PROMO_MUSIC.txt)を直接作成した。Codexが素材の配置、compositionの登録、Sunoの操作、音源の調整、書き出し、視覚確認を担当した。

音楽は2026年10月13日にSuno v6で2候補を生成。Studio Yebisuが選択した [Motion Guide — 動く作例から次の一本へ](https://suno.com/song/b4e784fd-9d8f-431d-bb91-75caf386e196) を使っている。実際にSunoへ渡した制作指示は、40秒・120 BPM・4/4・プラックシンセ・マレット・丸いベース・タイトなドラムによるインスト曲。音楽設計案と実際のSunoへの指示を、制作過程の資料として残しています。

選択したWAVは39.08秒、48 kHz stereo。冒頭の拍を合わせ、音量を約−16 LUFSに調整し、自然な終止後にタイトルを読める余白を置いて40秒にした。映像内では最後の2秒に音量のフェードを加えている。曲の選択と最終ミックスの聴感判断は別で、最終ミックスは利用者が試聴できる確認版。

動画と音源原本はこの公開ソースには含めず、ローカルの `renders/promo-20261013/` に保存する。原本のWAVと制作記録を保持している。コードのMITライセンスを、Suno楽曲の再配布許諾と解釈しない。

## 再生成

リポジトリのルートで実行する。

```text
npm --prefix examples/remotion ci
python scripts/render_promo.py --music /absolute/path/to/your-40-second-music.wav
python scripts/check_promo.py renders/promo-20261013/motion-guide-promo.mp4
```

`--music` を省略すると無音で書き出す。サイトの31件のMP4とポスターを `public/promo/` へコピーして描画する。音源は手元の利用可能なWAVを用意する。`renders/` と `public/promo/` はGit管理外。

Remotionからの原出力は `motion-guide-promo-render.mp4` に保持。JPEGフレーム由来のfull-rangeを標準的なBT.709・limited-range H.264へ変換し、AAC stereoとfaststartを付けた `motion-guide-promo.mp4` を共有用に使う。

確認した範囲：TypeScript型検査、40秒・1200フレーム・1080p、映像と音声の全編デコード、10地点の静止画、文字・終端URLの配置、ブラウザでの連続再生。全ライブラリ機能やモデル比較の検証ではない。
