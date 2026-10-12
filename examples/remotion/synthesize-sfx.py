"""Original synthesized sound follows the same timeline as the Whaley film."""
import json,wave,subprocess,math
from pathlib import Path
import numpy as np
root=Path(__file__).resolve().parents[2];tl=json.loads(Path(__file__).with_name('src').joinpath('whaley-timeline.json').read_text(encoding='utf-8'))
rate=48000;audio=np.zeros((int(tl['duration']*rate),2),dtype=np.float64);rng=np.random.default_rng(772)
out=root/'.qa/renders/claude-motion';out.mkdir(parents=True,exist_ok=True)
def beat(path):
    value=tl
    for part in path.split('.'):value=value[int(part)] if isinstance(value,list) else value[part]
    return value
def freq(note):
    semis={'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
    return 440*2**((semis[note[:-1]]+(int(note[-1])+1)*12-69)/12)
for cue in tl['audio']['cues']:
    start=beat(cue['beat'])+cue.get('offset',0);kind=cue['sound'];dur=cue.get('length',1.2 if kind=='chime' else .45)
    if kind=='riser':dur=beat(cue['endsAt'])-start
    n=int(rate*dur);t=np.arange(n)/rate
    attack=np.minimum(t/.01,1)
    if kind=='pad':
        signal=sum(np.sin(2*np.pi*freq(note)*t) for note in cue['notes'])/3
        signal*=np.minimum(t/.35,1)*np.minimum((dur-t)/.5,1)
        duck=cue['duck'];hit=beat(duck['beat']);signal*=1-duck['amount']*np.exp(-np.maximum(0,start+t-hit)/duck['release'])*(start+t>=hit)
    elif kind=='chime':signal=sum(np.sin(2*np.pi*freq(note)*t)*(np.exp(-t*(2.8+i*.4))) for i,note in enumerate(cue['notes']))/3*attack
    elif kind=='impact':signal=(np.sin(2*np.pi*(55*t+35/9*(1-np.exp(-9*t))))*.8+rng.normal(0,.17,n))*np.exp(-t*15)*attack
    elif kind in ['whoosh','riser']:
        noise=rng.normal(0,1,n);noise=np.convolve(noise,np.ones(12)/12,mode='same');signal=noise*np.sin(np.pi*t/dur)**2
        if kind=='riser':signal+=.1*np.sin(2*np.pi*(160*t+140*t*t))*t/dur
    else:
        signal=rng.normal(0,.3,n)*np.exp(-t*90)
        if 'blip' in kind:signal+=np.sin(2*np.pi*freq(cue.get('note','D5'))*t)*np.exp(-t*25)*attack
    signal*=cue['gain'];pan=cue.get('pan',0);stereo=signal[:,None]*[math.cos((pan+1)*math.pi/4),math.sin((pan+1)*math.pi/4)]
    pos=int(start*rate);length=min(n,len(audio)-pos);audio[pos:pos+length]+=stereo[:length]
peak=np.max(np.abs(audio));audio*=min(1,.88/max(peak,1e-8))
raw=out/'sfx-raw.wav'
with wave.open(str(raw),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(rate);f.writeframes((audio*32767).astype('<i2').tobytes())
analysis=subprocess.run(['ffmpeg','-v','info','-i',str(raw),'-af','loudnorm=I=-14:TP=-2:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
data=json.loads(analysis[analysis.rfind('{'):analysis.rfind('}')+1])
filter=f'loudnorm=I=-14:TP=-2:LRA=7:measured_I={data["input_i"]}:measured_TP={data["input_tp"]}:measured_LRA={data["input_lra"]}:measured_thresh={data["input_thresh"]}:offset={data["target_offset"]}:linear=true'
subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af',filter,'-ar','48000',str(out/'sfx.wav')],check=True)
(out/'sound-proof.json').write_text(json.dumps({'generator':'original NumPy synthesis','rate':rate,'cues':tl['audio']['cues'],'timeline':'examples/remotion/src/whaley-timeline.json','normalization':'two-pass loudnorm -14 LUFS, -2 dBTP','measured_input':data},indent=2),encoding='utf-8')
print('Original cue-synced SFX synthesized and normalized')
