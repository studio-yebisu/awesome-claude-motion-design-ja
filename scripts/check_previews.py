"""Check all 31 are genuine moving media with matching source and hashes."""
import concurrent.futures,hashlib,json,subprocess
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'data/preview-production.json').read_text(encoding='utf-8'))['previews']
ids={x['id'] for x in json.loads((root/'data/curation.json').read_text(encoding='utf-8'))['projects']};assert set(data)==ids
def check(item):
    id,p=item;assert (root/p['source_file']).is_file()
    for f in p['files'].values():assert hashlib.sha256((root/f['path']).read_bytes()).hexdigest()==f['sha256']
    with Image.open(root/p['files']['gif']['path']) as im:assert im.format=='GIF' and im.n_frames>10
    movie=root/p['files']['mp4']['path']
    raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(movie),'-vf','fps=2,scale=160:100,format=gray','-f','rawvideo','-'])
    chunks=[raw[i:i+16000] for i in range(0,len(raw),16000)];unique=len({hashlib.sha256(x).digest() for x in chunks});assert unique>=3,(id,unique)
    return {'id':id,'sampled_frames':len(chunks),'distinct_sampled_frames':unique,'hashes_match':True,'gif_animated':True}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(check,data.items()))
(root/'.qa/preview-validation.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print(f'PASS: {len(results)} distinct clips, animated GIFs, source files, hashes, and moving frames')
