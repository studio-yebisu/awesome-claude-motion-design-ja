"""Consult the explicitly requested Opus 5.5 through the user's Claude Code login."""
import argparse
import json
import pathlib
import subprocess
import time

ROOT = pathlib.Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt", type=pathlib.Path)
    parser.add_argument("output", type=pathlib.Path)
    parser.add_argument("--effort", default="high")
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    cmd = ["claude", "--print", "--model", "claude-opus-5-5", "--effort", args.effort,
           "--output-format", "json", "--tools", "", "--safe-mode",
           "--strict-mcp-config", "--no-session-persistence"]
    start = time.monotonic()
    result = subprocess.run(cmd, cwd=ROOT, input=args.prompt.read_text(encoding="utf-8"),
                            capture_output=True, encoding="utf-8")
    args.output.write_text(result.stdout, encoding="utf-8")
    args.output.with_suffix(".stderr.txt").write_text(result.stderr, encoding="utf-8")
    if result.returncode:
        print(f"Claude call failed (exit {result.returncode}); see {args.output.name}")
        print(result.stdout[:1500])
        raise SystemExit(result.returncode)
    data = json.loads(result.stdout)
    model_usage = data.get("modelUsage") or data.get("model_usage") or {}
    models = list(model_usage)
    text = data.get("result", "")
    args.output.with_suffix(".md").write_text(text, encoding="utf-8")
    print(json.dumps({"elapsed_seconds":round(time.monotonic()-start,1),
                      "models":models,"is_error":data.get("is_error"),
                      "output":args.output.with_suffix(".md").name},ensure_ascii=False))
    if data.get("is_error"):
        print(text[:1800])
        raise SystemExit(1)
    if not any("opus-5-5" in model for model in models):
        print("The result did not confirm requested Opus 5.5; review metadata before attribution.")


if __name__ == "__main__":
    main()
