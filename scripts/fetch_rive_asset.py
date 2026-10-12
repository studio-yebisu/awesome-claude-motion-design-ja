import json,urllib.request
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=next(s for s in json.loads((root/'data/verification.json').read_text(encoding='utf-8'))['sources'] if s['repository']=='rive-app/rive-runtime')
sha=source['commit_sha'];base=f'https://raw.githubusercontent.com/rive-app/rive-runtime/{sha}/'
folder=root/'examples/runtime/assets';folder.mkdir(parents=True,exist_ok=True)
for remote,local in [('tests/unit_tests/assets/rocket.riv','rocket.riv'),('LICENSE','RIVE-LICENSE.txt')]:
    with urllib.request.urlopen(base+remote,timeout=60) as r:folder.joinpath(local).write_bytes(r.read())
folder.joinpath('RIVE-ASSET.json').write_text(json.dumps({'asset':'rocket.riv','author':'Rive','role':'Official upstream test asset; playback demo, not an original .riv animation','license':'MIT','source':f'https://github.com/rive-app/rive-runtime/blob/{sha}/tests/unit_tests/assets/rocket.riv','commit':sha},indent=2),encoding='utf-8')
print('Official Rive test asset + license fetched at',sha)
