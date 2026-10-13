"""Prepare the example with CodeVideoModel's pinned code-video renderer."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import shutil
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
COMMIT = "404e03d67c2977b441622ce94411470bb84984a8"
UPSTREAM = "code-video-model/CodeVideoModel"
DESTINATION = ROOT / ".qa/code-video-model"


def prepare():
    DESTINATION.mkdir(parents=True, exist_ok=True)
    receipts = {}
    for remote, local in (
        ("inference/render.py", "render.py"),
        ("vendor/three.module.js", "vendor/three.module.js"),
        ("vendor/LICENSE.threejs", "vendor/LICENSE.threejs"),
        ("LICENSE", "LICENSE.CodeVideoModel"),
    ):
        url = f"https://raw.githubusercontent.com/{UPSTREAM}/{COMMIT}/{remote}"
        with urlopen(Request(url, headers={"User-Agent": "motion-guide-example"}), timeout=60) as response:
            body = response.read()
        target = DESTINATION / local
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(body)
        receipts[local] = {"url": url, "sha256": hashlib.sha256(body).hexdigest()}
    for path in (ROOT / "examples/code-video-model").rglob("*"):
        if path.is_file() and path.suffix in {".html", ".js", ".json"}:
            relative = path.relative_to(ROOT / "examples/code-video-model")
            target = DESTINATION / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path, target)
    (DESTINATION / "UPSTREAM.json").write_text(json.dumps({"repository": UPSTREAM, "commit": COMMIT, "files": receipts}, indent=2) + "\n", encoding="utf-8")
    print(f"Prepared pinned renderer and example: {DESTINATION}")
    print("python .qa/code-video-model/render.py preview --scene .qa/code-video-model")
    print("python .qa/code-video-model/render.py video --scene .qa/code-video-model")


if __name__ == "__main__":
    prepare()
