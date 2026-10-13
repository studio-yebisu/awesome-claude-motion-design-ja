"""Check the exported 40-second promo and make a small visual review sheet."""
from pathlib import Path
import argparse
import hashlib
import json
import subprocess
from PIL import Image, ImageDraw, ImageFont

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('video', type=Path)
    args = parser.parse_args()
    video = args.video.resolve()
    qa = video.parent / 'qa'
    qa.mkdir(parents=True, exist_ok=True)
    meta = json.loads(subprocess.run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)],capture_output=True,text=True,check=True).stdout)
    v = next(s for s in meta['streams'] if s['codec_type']=='video')
    a = next((s for s in meta['streams'] if s['codec_type']=='audio'),None)
    assert (v['width'],v['height'])==(1920,1080), v
    assert v['r_frame_rate']=='30/1', v
    assert abs(float(meta['format']['duration'])-40)<.1, meta['format']
    assert v['pix_fmt']=='yuv420p',v
    assert a and a['codec_name']=='aac' and a['sample_rate']=='48000' and a['channels']==2,a
    decoded = subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],capture_output=True,text=True,check=True)
    assert not decoded.stderr.strip(), decoded.stderr
    samples = [1.5,5.5,9.5,13.5,17.5,21.5,25.5,29.5,33.5,37.5]
    images=[]
    for n, t in enumerate(samples):
        frame = qa / f'frame-{n:02d}.jpg'
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(video),'-frames:v','1','-vf','scale=960:540','-q:v','2',str(frame)],check=True)
        images.append(Image.open(frame).convert('RGB'))
    font = ImageFont.truetype('C:/Windows/Fonts/consola.ttf',22)
    for group in range(2):
        group_images=images[group*5:(group+1)*5]
        sheet=Image.new('RGB',(1920,3*572),(29,32,35))
        draw=ImageDraw.Draw(sheet)
        for local,im in enumerate(group_images):
            x=(local%2)*960
            y=(local//2)*572
            sheet.paste(im,(x,y))
            draw.text((x+18,y+545),f"{samples[group*5+local]:04.1f}s",font=font,fill=(242,241,228))
        sheet.save(qa/f'contact-sheet-{group+1}.jpg',quality=94)
    result={'video':str(video),'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'metadata':meta,'full_av_decode':'pass','sample_times_seconds':samples,'technical_checks':'pass','visual_review':'review contact sheets and continuous playback separately','audio_listening':'user audition required; audio input is unavailable to this agent'}
    (qa/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'status':'PASS','width':v['width'],'height':v['height'],'fps':v['r_frame_rate'],'duration':meta['format']['duration'],'audio':a['codec_name'],'size_bytes':video.stat().st_size,'qa':str(qa)},ensure_ascii=False))

if __name__=='__main__':
    main()
