"""Create lightweight loop video, actual GIF and still poster for every entry."""
import argparse,concurrent.futures,hashlib,json,shutil,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
notes=json.loads((root/'data/preview-notes.json').read_text(encoding='utf-8'))
destination=root/'assets/previews';destination.mkdir(parents=True,exist_ok=True)
def run(cmd):subprocess.run(cmd,check=True,capture_output=True)
def package(id):
    note=notes[id];source=root/f'.qa/renders/{id}/original.mp4'
    if id=='manim':source=root/'.qa/manim-media/videos/epicycles/600p30/EpicyclePlate.mp4'
    assert source.exists(),f'{id}: actual render missing'
    assert (root/note['source_file']).exists(),f'{id}: source missing'
    movie=destination/f'{id}.mp4';gif=destination/f'{id}.gif';poster=destination/f'{id}.webp'
    run(['ffmpeg','-y','-v','error','-i',str(source),'-vf','scale=960:600,fps=30','-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',str(movie)])
    run(['ffmpeg','-y','-v','error','-i',str(movie),'-filter_complex','[0:v]fps=12,scale=480:300:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3','-loop','0',str(gif)])
    run(['ffmpeg','-y','-v','error','-ss',str(note['poster_time']),'-i',str(movie),'-frames:v','1','-quality','86',str(poster)])
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(movie)],text=True))
    stream=next(s for s in probe['streams'] if s['codec_type']=='video')
    assert stream['width']==960 and stream['height']==600
    assert int(stream.get('nb_frames',0))>=230
    files={p.suffix[1:]:{'path':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [movie,gif,poster]}
    result={**note,'status':'rendered_and_packaged','duration':float(probe['format']['duration']),'width':960,'height':600,'fps':30,'frame_count':int(stream['nb_frames']),'has_audio':any(s['codec_type']=='audio' for s in probe['streams']),'files':files}
    evidence=root/f'.qa/renders/{id}/capture.json'
    if evidence.exists():
        d=json.loads(evidence.read_text(encoding='utf-8'));result['runtime_feature']=d.get('feature');result['processing_proof']=d.get('processingProof')
    print(f'{id}: {result["duration"]:.1f}s / MP4 {movie.stat().st_size//1024}KB / GIF {gif.stat().st_size//1024}KB',flush=True)
    return result
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('ids',nargs='*');args=parser.parse_args();ids=args.ids or list(notes)
    manifest_path=root/'data/preview-production.json'
    existing=json.loads(manifest_path.read_text(encoding='utf-8')) if manifest_path.exists() else {'produced_on':'2026-10-13','model_consulted':'claude-opus-5-5','previews':{}}
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        for result in pool.map(package,ids):existing['previews'][result['id']]=result
    manifest_path.write_text(json.dumps(existing,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Packaged previews:',len(existing['previews']))
