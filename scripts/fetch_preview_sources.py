"""Fetch pinned, public skill instructions into ignored production context."""
import base64
import concurrent.futures
import json
from pathlib import Path
import subprocess

ROOT=Path(__file__).resolve().parents[1]
TARGETS={
 'remotion-dev/skills':['SKILL.md','compositions.md','multi-scene-video.md'],
 'emilkowalski/skills':['emil-design-eng/SKILL.md','review-animations/SKILL.md'],
 'charlie947/motion-graphics-skills':['SKILL.md'],
 'whaleyxbt/claude-motion':['SKILL.md'],
 'howseen-ai/claude-motion-design':['SKILL.md'],
 'abhimahamkali/claude-motion-skill':['SKILL.md','engine/render.mjs'],
 'iart-ai/kinetic-typography-skills':['SKILL.md','README.md','LICENSE'],
 'heygen-com/hyperframes':['hyperframes-core/SKILL.md','hyperframes-animation/SKILL.md'],
}

def gh(endpoint):
 p=subprocess.run(['gh','api',endpoint],capture_output=True,encoding='utf-8',check=True)
 return json.loads(p.stdout)

def fetch(repo,sha,path):
 data=gh(f'repos/{repo}/contents/{path}?ref={sha}')
 destination=ROOT/'.qa/upstream'/repo.replace('/','__')/path
 destination.parent.mkdir(parents=True,exist_ok=True)
 destination.write_bytes(base64.b64decode(data['content']))
 return {'repository':repo,'commit':sha,'path':path,'blob_sha':data['sha'],
         'source_url':f'https://github.com/{repo}/blob/{sha}/{path}',
         'local_path':str(destination.relative_to(ROOT))}

def main():
 verified=json.loads((ROOT/'data/verification.json').read_text(encoding='utf-8'))
 versions={r['repository']:r['commit_sha'] for r in verified['sources']}
 jobs=[]
 for repo,endings in TARGETS.items():
  sha=versions.get(repo)
  if not sha:
   meta=gh(f'repos/{repo}');sha=gh(f"repos/{repo}/commits/{meta['default_branch']}")['sha']
  tree=gh(f'repos/{repo}/git/trees/{sha}?recursive=1')
  paths=[n['path'] for n in tree['tree'] if n['type']=='blob' and any(n['path'].endswith(e) for e in endings)]
  print(f'{repo}: {len(paths)} source files',flush=True)
  jobs.extend((repo,sha,path) for path in paths)
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
  records=list(pool.map(lambda item:fetch(*item),jobs))
 out=ROOT/'.qa/skill-sources.json';out.write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
 print(f'Fetched {len(records)} pinned files for production context',flush=True)

if __name__=='__main__':main()
