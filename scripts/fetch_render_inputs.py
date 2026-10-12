import json,urllib.request
from pathlib import Path
root=Path(__file__).resolve().parents[1]
sources=json.loads((root/'data/verification.json').read_text(encoding='utf-8'))['sources']
def get(url):
    return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'motion-guide-source-audit'}),timeout=60).read()
for repo, paths in {
  'abhimahamkali/claude-motion-skill':[
      'plugins/motion/skills/motion/engine/template.html',
      'plugins/motion/skills/motion/references/style.md',
      'plugins/motion/skills/motion/examples/watermelon-to-pomegranate.html']}.items():
    sha=next(s['commit_sha'] for s in sources if s['repository']==repo)
    for path in paths:
        target=root/'.qa/upstream'/repo.replace('/','__')/path
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(get(f'https://raw.githubusercontent.com/{repo}/{sha}/{path}'))
        print('Fetched',path)
rive=next(s for s in sources if s['repository']=='rive-app/rive-runtime')
tree=json.loads(get(f'https://api.github.com/repos/rive-app/rive-runtime/git/trees/{rive["commit_sha"]}?recursive=1'))
assets=[x for x in tree['tree'] if x['path'].endswith('.riv') and x.get('size',1000000)<120000]
(root/'.qa/rive-assets.json').write_text(json.dumps(assets,indent=2),encoding='utf-8')
print('Rive small assets:',len(assets))
print('\n'.join(x['path'] for x in assets[:45]))
