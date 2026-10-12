"""Use the pinned skill template locally; publish only our scene and adapter."""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[2]
up=root/'.qa/upstream/abhimahamkali__claude-motion-skill/plugins/motion/skills/motion'
template=(up/'engine/template.html').read_text(encoding='utf-8')
template=re.sub(r'<link[^>]*>','',template)
template=template.replace('const W = 1080, H = 1920, FPS = 30, DUR = 12;','const W = 960, H = 600, FPS = 30, DUR = 12;')
template=template.replace('"\'Instrument Serif\', serif"','"Georgia, serif"').replace('"\'Inter\', sans-serif"','"Arial, sans-serif"')
start=template.index('/* ============================= SCENE')
end=template.index('/* ============================= BOOT',start)
template=template[:start]+Path(__file__).with_name('scene.js').read_text(encoding='utf-8')+'\n'+template[end:]
folder=root/'.qa/motion-skill';folder.mkdir(parents=True,exist_ok=True)
(folder/'scene.html').write_text(template,encoding='utf-8')
# The existing renderer owns a freshly created temp profile; assert that exact boundary before cleanup.
renderer=(up/'engine/render.mjs').read_text(encoding='utf-8')
renderer=renderer.replace('fs.rmSync(profile, { recursive: true, force: true })',"(() => { const p=path.resolve(profile); if (!p.startsWith(path.resolve(os.tmpdir())+path.sep+'motion-chrome-')) throw new Error('Unsafe temp cleanup target'); fs.rmSync(p, {recursive:true,force:true}); })()")
(folder/'render.mjs').write_text(renderer,encoding='utf-8')
print('Prepared local-only upstream template with original scene')
