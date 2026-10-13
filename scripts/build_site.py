"""Build a dependency-free Japanese resource guide from its curated JSON."""
from __future__ import annotations

import collections
import html
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO_URL = "https://github.com/studio-yebisu/awesome-claude-motion-design-ja"
SITE_URL = "https://studio-yebisu.github.io/awesome-claude-motion-design-ja/"
esc = html.escape
SOCIAL_IMAGE = SITE_URL + "assets/og-card-motion-v2.png"
SOCIAL_ALT = "Claude モーショングラフィック制作ガイド。31本の動く作例と、文字・3D・2D・図解など6種類の制作例。"


def social_metadata(path, title, description):
    url = SITE_URL + ("" if path == "index.html" else path)
    values = [
        ("property", "og:type", "website"),
        ("property", "og:locale", "ja_JP"),
        ("property", "og:site_name", "Claude モーション制作ガイド / StudioYebisu"),
        ("property", "og:title", title),
        ("property", "og:description", description),
        ("property", "og:url", url),
        ("property", "og:image", SOCIAL_IMAGE),
        ("property", "og:image:secure_url", SOCIAL_IMAGE),
        ("property", "og:image:type", "image/png"),
        ("property", "og:image:width", "1200"),
        ("property", "og:image:height", "630"),
        ("property", "og:image:alt", SOCIAL_ALT),
        ("name", "twitter:card", "summary_large_image"),
        ("name", "twitter:site", "@studio_yebisu"),
        ("name", "twitter:title", title),
        ("name", "twitter:description", description),
        ("name", "twitter:image", SOCIAL_IMAGE),
        ("name", "twitter:image:alt", SOCIAL_ALT),
    ]
    return f'<link rel="canonical" href="{url}">\n' + "\n".join(
        f'<meta {kind}="{key}" content="{esc(value, quote=True)}">'
        for kind, key, value in values
    )


def read_json(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def preview_markup(preview):
    if not preview:
        return '<p class="preview-pending">作例の制作中</p>'
    v=preview
    source=f"{REPO_URL}/blob/main/{v['source_file']}"
    native=f'<a href="{v["native_output"]["path"]}">処理した元ファイル ↗</a>' if v.get('native_output') else ''
    return f'''<figure class="specimen"><div class="specimen-screen"><video data-preview data-src="{v['files']['mp4']['path']}" poster="{v['files']['webp']['path']}" preload="none" muted loop playsinline aria-label="{esc(v['title'],quote=True)}"></video><button class="preview-opener" type="button" data-open-preview="{v['files']['mp4']['path']}" data-title="{esc(v['title'],quote=True)}" data-description="{esc(v['description'],quote=True)}" data-gif="{v['files']['gif']['path']}" data-source="{source}" aria-label="{esc(v['title'],quote=True)}を拡大再生"><span>拡大して再生 ↗</span></button></div><figcaption><span class="preview-role">{esc(v['role'])}</span><strong>{esc(v['title'])}</strong><p>{esc(v['description'])}</p><div class="preview-links"><a href="{v['files']['gif']['path']}">GIF ↗</a><a href="{source}" target="_blank" rel="noopener noreferrer">制作コード ↗</a>{native}<span>{v['duration']:g}秒 / {v['version']}</span></div></figcaption></figure>'''


def project_card(project, categories):
    p = project
    origin = "元ポスト" if p["origin"] == "source_post" else "追加調査"
    license_url = p["license_url"]
    tags = "".join(f'<span>{esc(tag)}</span>' for tag in p["tags"])
    search = " ".join(str(p[k]) for k in ("name", "repository", "summary", "use_case", "opus_relation")) + " " + " ".join(p["tags"])
    preview = preview_markup(p.get("preview"))
    command = f'<div class="install"><code>{esc(p["install"])}</code><button type="button" data-copy-command aria-label="{esc(p["name"])}の導入コマンドをコピー">コピー</button></div>' if p.get("install") else ""
    return f'''<article class="project-card" id="{esc(p['id'])}" data-project data-category="{esc(p['category'])}" data-origin="{esc(p['origin'])}" data-license="{esc(p['license_class'])}" data-search="{esc(search.lower(), quote=True)}" style="--accent:{categories[p['category']]['color']}">
      {preview}
      <div class="project-top"><span class="project-kind">{esc(p['kind'])}</span><span class="origin {p['origin']}">{origin}</span></div>
      <h2><a href="{p['url']}" target="_blank" rel="noopener noreferrer">{esc(p['name'])}<span aria-hidden="true"> ↗</span></a></h2>
      <p class="repo-name">{esc(p['repository'])}</p><p class="project-summary">{esc(p['summary'])}</p>
      <p class="use-case"><b>使いどころ</b>{esc(p['use_case'])}</p><div class="tags">{tags}</div>
      <div class="project-meta"><a href="{license_url}" target="_blank" rel="noopener noreferrer">{esc(p['license_label'])}</a><span title="GitHubリポジトリ全体のstar数。品質や利用者数を示す値ではありません。">★ {p['stars']:,}</span></div>
      <details><summary>導入条件・Claudeとの組み合わせ</summary><div class="detail-body"><p><b>環境</b> {esc(p['requirements'])}</p><p><b>Claudeとの関係</b> {esc(p['opus_relation'])}</p><p><b>利用時の確認</b> {esc(p['caution'])}</p>{command}<p class="verification-label">確認範囲：一次資料と、この項目の専用作例の制作・実行。全機能の検証ではありません。</p><a href="{p['readme_url']}" target="_blank" rel="noopener noreferrer">確認したREADME ↗</a> <span class="commit-label">{p['commit_sha'][:7]}</span></div></details>
    </article>'''


def build():
    curation = read_json("data/curation.json")
    verification = read_json("data/verification.json")
    production = read_json("data/preview-production.json")["previews"]
    assert not verification["errors"], verification["errors"]
    sources = {p["repository"]: p for p in verification["sources"]}
    categories = {c["id"]: c for c in curation["categories"]}
    assert len({p["id"] for p in curation["projects"]}) == len(curation["projects"])
    projects = []
    overrides = {
        "greensock/GSAP": "https://gsap.com/community/standard-license/",
        "ffmpegwasm/ffmpeg.wasm": "https://ffmpegwasm.netlify.app/docs/faq/#what-is-the-license-of-ffmpegwasm",
    }
    for p in curation["projects"]:
        metadata = sources[p["repository"]]
        assert p["category"] in categories
        assert not metadata["archived"], p["repository"]
        item = {**p, **metadata}
        license_path = next((path for path in metadata["license_paths"] if path.lower().split(".")[0] in {"license","licence"}), (metadata["license_paths"] or [None])[0])
        item["license_url"] = overrides.get(p["repository"]) or (
            f"{metadata['url']}/blob/{metadata['commit_sha']}/{license_path}" if license_path else metadata["readme_url"])
        item["preview"] = production.get(p["id"])
        projects.append(item)
    counts = collections.Counter(p["category"] for p in projects)
    total = len(projects)
    additions = sum(p["origin"] == "additional" for p in projects)
    assert sum(p["origin"] == "source_post" for p in projects) == 10
    curation["projects"] = projects
    (ROOT / "data/projects.json").write_text(json.dumps(curation, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    representatives={"skills":"remotion-skills","render":"hyperframes","ui":"gsap","three":"three","vector":"pixi","data":"deck"}
    by_id={p["id"]:p for p in projects}
    cards = []
    for category in categories.values():
        kind = category["id"]
        cards.append(f'''<article class="category-card" style="--accent:{category['color']}"><div class="category-top"><span>{category['label']}</span><span>{counts[kind]}件</span></div>{preview_markup(by_id[representatives[kind]].get("preview"))}<div class="category-body"><h3><a href="projects.html?category={kind}">{category['name']}</a></h3><p>{category['description']}</p><p class="category-examples">{category['examples']}</p><a class="category-action" href="projects.html?category={kind}">一覧を見る<span aria-hidden="true">→</span></a></div></article>''')
    filters = '<button class="filter-chip active" type="button" data-category-filter="all" aria-pressed="true">すべて <span>'+str(total)+'</span></button>'
    filters += "".join(f'<button class="filter-chip" type="button" data-category-filter="{c["id"]}" aria-pressed="false">{c["short"]} <span>{counts[c["id"]]}</span></button>' for c in categories.values())
    replacements = {"{{TOTAL}}":str(total), "{{ADDITIONS}}":str(additions), "{{CATEGORY_CARDS}}":"\n".join(cards), "{{FILTERS}}":filters, "{{PROJECT_CARDS}}":"\n".join(project_card(p,categories) for p in projects), "{{SITE_URL}}":SITE_URL, "{{REPO_URL}}":REPO_URL}
    social_pages = {
        "index.html": ("Claude モーショングラフィック制作ガイド｜31本の動く作例", "Opus 5.5向け。31本の動く作例から、制作スキル・ツールを日本語で比較。GIF・制作コード・出典付き。"),
        "projects.html": ("31本の動く作例｜Claude モーショングラフィック制作ガイド", "制作スキル・動画・UI・3D・2D・図解の31件を検索・比較。動く作例、GIF、制作コードをまとめて確認。"),
        "guide.html": ("スタックの組み方｜Claude モーショングラフィック制作ガイド", "HTML動画、React動画、触れるWeb、技術解説。つくりたいものから、スキル・描画・書き出しをつなぐ4ルート。"),
    }
    for name in ("index.html", "projects.html", "guide.html"):
        text = (ROOT / "templates" / name).read_text(encoding="utf-8")
        text = text.replace("{{SOCIAL_META}}", social_metadata(name, *social_pages[name]))
        for key,value in replacements.items():
            text = text.replace(key,value)
        assert "{{" not in text, name
        (ROOT / name).write_text(text,encoding="utf-8")
    table = []
    for category in categories.values():
        table += [f"\n### {category['name']}（{counts[category['id']]}件）\n", "| スキル・ツール | 使いどころ | ライセンス | 出所 |\n| --- | --- | --- | --- |"]
        for p in projects:
            if p["category"] == category["id"]:
                origin = "元ポスト" if p["origin"] == "source_post" else "追加調査"
                table.append(f"| [{p['name']}]({p['url']}) | {p['use_case']} | [{p['license_label']}]({p['license_url']}) | {origin} |")
    readme = f'''# Claude モーショングラフィック制作ガイド

Claude Opus 5.5を使ったモーショングラフィック制作のための日本語ガイド。制作スキル、描画ライブラリ、書き出しエンジンを用途から選べます。

**[まとめサイトを開く]({SITE_URL})** · **[全{total}件の検索・比較]({SITE_URL}projects.html)** · **[スタックの組み方]({SITE_URL}guide.html)**

元になった[damkinさんのXポスト]({curation['source_post']})の10件に、一次資料を確認した{additions}件を追加。確認日：2026年10月12日（日本時間）。

![ガイドの表紙](assets/og-card.png)

## まず何を選ぶか

| つくりたいもの | 構成の入口 | 詳細 |
| --- | --- | --- |
| HTMLで短い商品紹介・文字演出 | HyperFrames + 公式制作スキル + 時刻指定できるアニメーション | [HTML動画のルート]({SITE_URL}guide.html#html) |
| 差し替えて使う動画テンプレート | Remotion + 公式Agent Skills + React | [React動画のルート]({SITE_URL}guide.html#react) |
| 触れるUI・製品サイト | MotionまたはGSAP + Emil Kowalski Skills | [Webのルート]({SITE_URL}guide.html#web) |
| 数式・仕組みの解説 | ManimまたはMotion Canvas + 場面の構成表 | [解説動画のルート]({SITE_URL}guide.html#explain) |

これらは資料をもとにした編集上の提案です。Opus 5.5に全体設計とスキル適用・実装を相談し、各項目に専用作例を制作しました。モデル間の性能比較は行っていません。

## Claudeと各ツールの役割

Claudeが構成やコードをつくり、描画・動画化はブラウザやレンダラーが行います。スキルは制作の判断基準と進め方を伝えるもので、単体の動画エンジンではありません。ライブラリの多くは特定モデル専用ではありません。

[Anthropicのモデル設定ガイド](https://code.claude.com/docs/en/model-config)に従い、`claude --model claude-opus-5-5`で版を指定できます。`/status`で現在のモデルを確認します。

## 用途別一覧

{chr(10).join(table)}

## 調査と表示の範囲

- 一次資料：各公開リポジトリのREADME、公開ライセンス、公式ドキュメント。
- 確認した版とGitHub star数は[data/verification.json](data/verification.json)に記録。star数はリポジトリ全体の値で、品質や利用者数を表しません。
- 作者が公開した作例・実績と、このガイドでの検証を区別しています。全31項目に専用の動画を制作。描画、処理、スキル適用、公式素材の再生、参考資料の方法適用を各作例の説明で区別しています。
- RemotionとGSAPは独自条件のあるソフトウェア。LICENSE未確認の公開スキルや参考資料も、明示した上で掲載しています。
- サイトの動く作例は実行したMP4。全件にGIF・ポスター・制作コードを掲載。[制作記録](docs/作例の制作記録.md)と[data/preview-production.json](data/preview-production.json)で使用版、役割、実出力を確認できます。
- Riveのrocket.rivは公式MITテスト素材で、独自制作の.rivではありません。iart索引からはkinetic-typographyパックを選択。事例集は制作方法の参照として適用しました。
- 詳細は[調査ノート](docs/調査ノート.md)、[出典とライセンス](docs/出典とライセンス.md)、[制作スタック](docs/制作スタック.md)へ。

## ローカルで表示する

Python 3だけで表示・再生成できます。サイト閲覧のためのnpm依存はありません。

```text
python scripts/build_site.py
python scripts/check_site.py
python -u -m http.server 0 --bind 127.0.0.1
```

ターミナルに表示されたローカルURLを開いてください。空いているポートを使います。公開はGitHub Pagesの`main`ブランチ、ルートディレクトリを使用します。

編集対象は[data/curation.json](data/curation.json)、[templates](templates/)、[assets](assets/)。`index.html`、`projects.html`、`data/projects.json`、このREADMEはビルド生成物です。

一次資料の更新は[scripts/collect_sources.py](scripts/collect_sources.py)で行えます。`--evidence-dir`には公開リポジトリの外を指定し、取得した第三者READMEをサイトに再配布しないでください。

## 関連ガイド

[AIスライド制作ガイド](https://studio-yebisu.github.io/awesome-codex-ppt-skills-ja/) · 編集：StudioYebisu

## ライセンス

本ガイドのオリジナル文章、データ、コード、図版はMIT。掲載先のコード、素材、名称、事例には、それぞれのライセンス・利用条件が適用されます。Anthropicおよび掲載プロジェクトの公式サイトではありません。
'''
    (ROOT / "README.md").write_text(readme,encoding="utf-8")
    print(f"Built {total} entries across {len(categories)} categories; {additions} additional entries.")


if __name__ == "__main__":
    build()
