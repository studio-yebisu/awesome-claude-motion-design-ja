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


def read_json(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def artwork(category):
    artworks = {
        "skills": '<div class="art-board"><div class="board-label">YOUR BRIEF</div><div class="board-line"></div><div class="board-line short"></div><div class="board-steps"><span>PLAN</span><span>BUILD</span><span>REVIEW</span></div><div class="board-cursor" data-demo-cursor>↗</div></div>',
        "render": '<div class="art-render"><div class="render-sheet rear"></div><div class="render-sheet front"><span>HTML</span><b data-demo-render>→</b><span>MP4</span></div><div class="render-timeline"><i data-demo-playhead></i><span></span><span></span><span></span></div><small>FRAME BY FRAME</small></div>',
        "ui": '<div class="art-type"><div class="type-word" aria-hidden="true"><span data-demo-letter="0">M</span><span data-demo-letter="1">O</span><span data-demo-letter="2">V</span><span data-demo-letter="3">E</span><b>.</b></div><div class="type-pill" data-demo-pill>JUST RIGHT <span>↗</span></div></div>',
        "three": '<div class="art-depth"><div class="depth-orbit"></div><div class="depth-orbit second"></div><div class="cube" data-demo-cube><i class="face face-front"></i><i class="face face-back"></i><i class="face face-left"></i><i class="face face-right"></i><i class="face face-top"></i><i class="face face-bottom"></i></div><span class="depth-label">A LITTLE DEPTH.</span></div>',
        "vector": '<svg class="art-vector" viewBox="0 0 400 190" aria-hidden="true"><g data-demo-petals transform="translate(145 94)"><ellipse rx="25" ry="64" fill="#edaaaf"/><ellipse rx="25" ry="64" fill="#edaaaf" transform="rotate(60)"/><ellipse rx="25" ry="64" fill="#edaaaf" transform="rotate(120)"/><circle r="18" fill="#181d22"/></g><g data-demo-vector transform="translate(274 94)"><rect x="-40" y="-40" width="80" height="80" rx="23" fill="none" stroke="#f5eee2" stroke-width="3"/><circle r="22" fill="#f5eee2"/></g><path d="M75 170H327" stroke="#ffffff" stroke-opacity=".18"/></svg>',
        "data": '<svg class="art-data" viewBox="0 0 400 190" aria-hidden="true"><path d="M65 35V155H340M65 115H340M65 75H340M65 35H340" fill="none" stroke="#fff" stroke-opacity=".13"/><g fill="#aebee8"><rect data-demo-bar="0" x="88" y="75" width="38" height="80" rx="5"/><rect data-demo-bar="1" x="149" y="54" width="38" height="101" rx="5"/><rect data-demo-bar="2" x="210" y="92" width="38" height="63" rx="5"/><rect data-demo-bar="3" x="271" y="38" width="38" height="117" rx="5"/></g><text x="68" y="181" fill="#b4bdc7" font-size="10" letter-spacing="2">ILLUSTRATIVE DATA</text></svg>',
    }
    return artworks[category]


def project_card(project, categories):
    p = project
    origin = "元ポスト" if p["origin"] == "source_post" else "追加調査"
    license_url = p["license_url"]
    tags = "".join(f'<span>{esc(tag)}</span>' for tag in p["tags"])
    search = " ".join(str(p[k]) for k in ("name", "repository", "summary", "use_case", "opus_relation")) + " " + " ".join(p["tags"])
    command = f'<div class="install"><code>{esc(p["install"])}</code><button type="button" data-copy-command aria-label="{esc(p["name"])}の導入コマンドをコピー">コピー</button></div>' if p.get("install") else ""
    return f'''<article class="project-card" id="{esc(p['id'])}" data-project data-category="{esc(p['category'])}" data-origin="{esc(p['origin'])}" data-license="{esc(p['license_class'])}" data-search="{esc(search.lower(), quote=True)}" style="--accent:{categories[p['category']]['color']}">
      <div class="project-top"><span class="project-kind">{esc(p['kind'])}</span><span class="origin {p['origin']}">{origin}</span></div>
      <h2><a href="{p['url']}" target="_blank" rel="noopener noreferrer">{esc(p['name'])}<span aria-hidden="true"> ↗</span></a></h2>
      <p class="repo-name">{esc(p['repository'])}</p><p class="project-summary">{esc(p['summary'])}</p>
      <p class="use-case"><b>使いどころ</b>{esc(p['use_case'])}</p><div class="tags">{tags}</div>
      <div class="project-meta"><a href="{license_url}" target="_blank" rel="noopener noreferrer">{esc(p['license_label'])}</a><span title="GitHubリポジトリ全体のstar数。品質や利用者数を示す値ではありません。">★ {p['stars']:,}</span></div>
      <details><summary>導入条件・Claudeとの組み合わせ</summary><div class="detail-body"><p><b>環境</b> {esc(p['requirements'])}</p><p><b>Claudeとの関係</b> {esc(p['opus_relation'])}</p><p><b>利用時の確認</b> {esc(p['caution'])}</p>{command}<p class="verification-label">確認範囲：README・ライセンス等の一次資料。実生成テストは未実施。</p><a href="{p['readme_url']}" target="_blank" rel="noopener noreferrer">確認したREADME ↗</a> <span class="commit-label">{p['commit_sha'][:7]}</span></div></details>
    </article>'''


def build():
    curation = read_json("data/curation.json")
    verification = read_json("data/verification.json")
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
        projects.append(item)
    counts = collections.Counter(p["category"] for p in projects)
    total = len(projects)
    additions = sum(p["origin"] == "additional" for p in projects)
    assert sum(p["origin"] == "source_post" for p in projects) == 10
    curation["projects"] = projects
    (ROOT / "data/projects.json").write_text(json.dumps(curation, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    cards = []
    for category in categories.values():
        kind = category["id"]
        cards.append(f'''<article class="category-card" style="--accent:{category['color']}"><div class="category-top"><span>{category['label']}</span><span>{counts[kind]}件</span></div><a class="category-art" href="projects.html?category={kind}" aria-label="{category['name']}の一覧を見る">{artwork(kind)}</a><div class="category-body"><h3><a href="projects.html?category={kind}">{category['name']}</a></h3><p>{category['description']}</p><p class="category-examples">{category['examples']}</p><a class="category-action" href="projects.html?category={kind}">一覧を見る<span aria-hidden="true">→</span></a></div></article>''')
    filters = '<button class="filter-chip active" type="button" data-category-filter="all" aria-pressed="true">すべて <span>'+str(total)+'</span></button>'
    filters += "".join(f'<button class="filter-chip" type="button" data-category-filter="{c["id"]}" aria-pressed="false">{c["short"]} <span>{counts[c["id"]]}</span></button>' for c in categories.values())
    replacements = {"{{TOTAL}}":str(total), "{{ADDITIONS}}":str(additions), "{{CATEGORY_CARDS}}":"\n".join(cards), "{{FILTERS}}":filters, "{{PROJECT_CARDS}}":"\n".join(project_card(p,categories) for p in projects), "{{SITE_URL}}":SITE_URL, "{{REPO_URL}}":REPO_URL}
    for name in ("index.html", "projects.html"):
        text = (ROOT / "templates" / name).read_text(encoding="utf-8")
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

これらは資料をもとにした編集上の提案です。各スタックのOpus 5.5による実生成比較は行っていません。

## Claudeと各ツールの役割

Claudeが構成やコードをつくり、描画・動画化はブラウザやレンダラーが行います。スキルは制作の判断基準と進め方を伝えるもので、単体の動画エンジンではありません。ライブラリの多くは特定モデル専用ではありません。

[Anthropicのモデル設定ガイド](https://code.claude.com/docs/en/model-config)に従い、`claude --model claude-opus-5-5`で版を指定できます。`/status`で現在のモデルを確認します。

## 用途別一覧

{chr(10).join(table)}

## 調査と表示の範囲

- 一次資料：各公開リポジトリのREADME、公開ライセンス、公式ドキュメント。
- 確認した版とGitHub star数は[data/verification.json](data/verification.json)に記録。star数はリポジトリ全体の値で、品質や利用者数を表しません。
- 作者が公開した作例・実績と、このガイドでの検証を区別しています。こちらで全ツールのインストールやOpus 5.5実生成は行っていません。
- RemotionとGSAPは独自条件のあるソフトウェア。LICENSE未確認の公開スキルや参考資料も、明示した上で掲載しています。
- サイトのカテゴリの動きと[seek(t)の見本](examples/seek-demo/)は本ガイド独自の表現見本です。
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
