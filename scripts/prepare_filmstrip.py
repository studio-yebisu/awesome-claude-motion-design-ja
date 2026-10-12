import json,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];target=root/'examples/playwright/frames';target.mkdir(parents=True,exist_ok=True)
frames=[24,60,120,189]
for frame in frames:
    shutil.copyfile(root/f'.qa/renders/gsap/frame-{frame:04}.png',target/f'{frame:04}.png')
(target/'metadata.json').write_text(json.dumps({'source_scene':'gsap','capture_tool':'Playwright 1.64.0','browser':'Chrome 154.0.8037.99','fps':30,'frame_numbers':frames,'times':[f/30 for f in frames]},indent=2),encoding='utf-8')
print('Four actual captured frames packaged')
