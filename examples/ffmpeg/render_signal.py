"""Create a procedural signal poster with real FFmpeg filters, no input video."""
import json
from pathlib import Path
import subprocess

root=Path(__file__).resolve().parents[2]
out=root/'.qa/renders/ffmpeg';out.mkdir(parents=True,exist_ok=True)
# X/Y are pixels; T is seconds. Two integer phase cycles close the loop.
wave="sin(X/75+sin(Y/95-T*PI/4)*3+T*PI/2)"
expr=f"18+180*pow(max(0,{wave}),12)"
filters=[f"geq=r='{expr}':g='24+190*pow(max(0,{wave}),12)':b='28+120*pow(max(0,{wave}),12)'",
"drawtext=fontfile='C\\:/Windows/Fonts/arialbd.ttf':text='THE SIGNAL':x=45:y=58:fontsize=88:fontcolor=0xf2efe8",
"drawtext=fontfile='C\\:/Windows/Fonts/consola.ttf':text='ONE FORMULA. EIGHT SECONDS.':x=49:y=163:fontsize=23:fontcolor=0xf2efe8",
"drawtext=fontfile='C\\:/Windows/Fonts/consola.ttf':text='FFMPEG / LAVFI + GEQ + DRAWTEXT':x=40:y=554:fontsize=16:fontcolor=0xf2efe8",
'format=yuv420p']
script=out/'filter.txt';script.write_text(','.join(filters),encoding='utf-8')
cmd=['ffmpeg','-y','-v','error','-f','lavfi','-i','color=c=black:s=960x600:r=30:d=8','-filter_script:v',str(script),'-c:v','libx264','-crf','20','-preset','medium','-movflags','+faststart',str(out/'original.mp4')]
subprocess.run(cmd,check=True)
(out/'capture.json').write_text(json.dumps({'id':'ffmpeg','feature':'lavfi, geq time expression, drawtext, H.264 encoding','command':cmd,'frames':240},indent=2),encoding='utf-8')
print('FFmpeg Signal rendered')
