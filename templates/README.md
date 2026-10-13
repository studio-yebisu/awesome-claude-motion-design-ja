# Claude モーショングラフィック制作ガイド

**{{CREATOR_CREDIT}}**

Studio Yebisuのオリジナル企画。Claude Opus 5.5と制作スキルを活用し、{{TOTAL}}のスキル・ツールそれぞれに動く作例を制作しました。動画・GIF・制作コードを見ながら、つくりたい表現に合う道具を選べる日本語ガイドです。

**[サイトを開く]({{SITE_URL}})** · **[{{TOTAL}}本の作例を見る]({{SITE_URL}}projects.html)** · **[スタックの組み方]({{SITE_URL}}guide.html)**

![Studio YebisuのClaudeモーショングラフィック制作ガイド](assets/og-card.png)

## 動く作例から、次の一本へ。

- **{{TOTAL}}本のオリジナル作例**：各スキル・ツールを使い、文字演出、UI、3D、2D、図解などを制作。拡大再生して動きを確かめられます。
- **GIFと制作コード**：気に入った表現を、その場で見比べて実装へ進めます。
- **6カテゴリと4つの制作ルート**：用途、必要な環境、組み合わせから道具を選べます。
- **40秒の紹介動画**：このガイドのために構成・演出し、オリジナル作例とSunoで制作した楽曲を編集。[制作コード・構成表](examples/remotion/PROMO_README.md)も公開しています。

## まず何をつくるか

| つくりたいもの | スタックの入口 | 詳細 |
| --- | --- | --- |
| 短い商品紹介・文字演出 | HyperFrames + 公式制作スキル + HTML | [HTML動画のルート]({{SITE_URL}}guide.html#html) |
| 差し替えて使う動画テンプレート | Remotion + 公式Agent Skills + React | [React動画のルート]({{SITE_URL}}guide.html#react) |
| 触れるUI・製品サイト | Motion / GSAP + Emil Kowalski Skills | [Webのルート]({{SITE_URL}}guide.html#web) |
| 数式・仕組みの解説 | Manim / Motion Canvas + 場面の構成表 | [解説動画のルート]({{SITE_URL}}guide.html#explain) |

## 制作について

本ガイドはStudio Yebisuのアイデアから始まった制作プロジェクトです。企画・構成・ツールの選定・編集・制作ディレクションをStudio Yebisuが担い、Claude Opus 5.5、Codex、制作スキルを活用して実装・レンダリング・仕上げを進めました。掲載する作例動画と紹介動画は、この企画のために制作したオリジナル作品です。

作品をつくるときは、伝えたいことと完成形を決め、エージェントに構成とコードを依頼します。制作スキルがデザインや実装の判断を支え、ブラウザやレンダラーがフレームを描き、動画処理で音と映像を仕上げます。

[作例の制作記録](docs/作例の制作記録.md) · [制作コードと再現手順](examples/README.md) · [制作スタック](docs/制作スタック.md)

## スキル・ツール一覧

{{README_TABLE}}

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
